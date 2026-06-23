<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Notification;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\ReportComment;
use App\Models\ReportStatusLog;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OperatorController extends Controller
{
    /**
     * Allowed status transitions map.
     * Key = current status, Value = array of statuses it can transition to.
     */
    private const STATUS_TRANSITIONS = [
        'diterima'     => ['diverifikasi', 'ditolak', 'diteruskan'],
        'diverifikasi' => ['diproses', 'ditolak', 'diteruskan'],
        'diproses'     => ['selesai', 'diteruskan'],
        'diteruskan'   => ['diterima', 'diverifikasi', 'diproses'],
        'selesai'      => [],
        'ditolak'      => ['diterima'], // Allow reopening
    ];

    /**
     * Display operator dashboard with stats and trends.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();

        // Base query: scoped to operator's unit unless admin
        $baseQuery = Report::query();
        if ($user->role === 'operator' && $user->unit_id) {
            $baseQuery->where('unit_id', $user->unit_id);
        }

        $newReportsCount = (clone $baseQuery)->where('status', 'diterima')->count();
        $processingCount = (clone $baseQuery)->whereIn('status', ['diverifikasi', 'diproses'])->count();

        $completedThisMonth = (clone $baseQuery)
            ->where('status', 'selesai')
            ->whereMonth('resolved_at', Carbon::now()->month)
            ->whereYear('resolved_at', Carbon::now()->year)
            ->count();

        // Reports approaching SLA deadline (within 3 days or overdue)
        $approachingSla = (clone $baseQuery)
            ->whereNotNull('deadline')
            ->whereNotIn('status', ['selesai', 'ditolak'])
            ->where('deadline', '<=', Carbon::now()->addDays(3))
            ->with(['category:id,name', 'user:id,name', 'unit:id,name'])
            ->orderBy('deadline', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($report) {
                return [
                    'id'             => $report->id,
                    'ticket_number'  => $report->ticket_number,
                    'title'          => $report->title,
                    'status'         => $report->status,
                    'status_label'   => $report->status_label,
                    'priority'       => $report->priority,
                    'deadline'       => $report->deadline->toISOString(),
                    'is_overdue'     => $report->is_overdue,
                    'category'       => $report->category,
                    'user'           => $report->is_anonymous ? null : $report->user,
                ];
            });

        // Weekly trend: reports received per day for the last 7 days
        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = (clone $baseQuery)
                ->whereDate('created_at', $date->toDateString())
                ->count();
            $weeklyTrend[] = [
                'date'  => $date->format('D, d M'),
                'count' => $count,
            ];
        }

        return Inertia::render('Operator/Dashboard', [
            'stats' => [
                'new_reports'       => $newReportsCount,
                'processing'        => $processingCount,
                'completed_month'   => $completedThisMonth,
            ],
            'approachingSla' => $approachingSla,
            'weeklyTrend'    => $weeklyTrend,
        ]);
    }

    /**
     * List reports with full filtering, sorting, and pagination.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Report::with([
            'category:id,name,icon',
            'unit:id,name',
            'user:id,name,email',
            'assignee:id,name',
        ]);

        // Scope to operator's unit unless admin
        if ($user->role === 'operator' && $user->unit_id) {
            $query->where('unit_id', $user->unit_id);
        }

        // Filter: status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter: category
        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Filter: priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        // Filter: date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Search by title, ticket number, or reporter name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortBy = $request->input('sort', 'created_at');
        $sortDir = $request->input('direction', 'desc');
        $allowedSorts = ['created_at', 'title', 'status', 'priority', 'ticket_number', 'deadline'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Operator/Reports/Index', [
            'reports'    => $reports,
            'filters'    => $request->only(['status', 'category', 'priority', 'date_from', 'date_to', 'search', 'sort', 'direction']),
            'statuses'   => Report::STATUS_LABELS,
            'priorities' => Report::PRIORITY_LABELS,
            'categories' => Category::active()->ordered()->get(['id', 'name']),
            'units'      => Unit::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Show a single report with full details for the operator.
     */
    public function show(Report $report): Response
    {
        $user = Auth::user();

        // Scope check: operator can only see reports from their unit (admin can see all)
        if ($user->role === 'operator' && $user->unit_id && $report->unit_id !== $user->unit_id) {
            abort(403, 'Anda tidak memiliki akses ke laporan unit lain.');
        }

        $report->load([
            'category:id,name,icon,description',
            'unit:id,name,sla_days',
            'user:id,name,email,phone,avatar',
            'assignee:id,name,email',
            'attachments',
            'comments' => function ($query) {
                $query->with('user:id,name,role,avatar')
                    ->orderBy('created_at', 'asc');
            },
            'statusLogs' => function ($query) {
                $query->with('changedBy:id,name,role')
                    ->orderBy('created_at', 'asc');
            },
        ]);

        // Available operators for assignment (from the report's unit or all if admin)
        $availableOperators = User::where('role', 'operator')
            ->where('is_active', true)
            ->when($report->unit_id, function ($q) use ($report) {
                $q->where('unit_id', $report->unit_id);
            })
            ->get(['id', 'name', 'email']);

        // Allowed next statuses for the status transition dropdown
        $allowedTransitions = self::STATUS_TRANSITIONS[$report->status] ?? [];

        return Inertia::render('Operator/Reports/Show', [
            'report'             => $report,
            'attachments'        => $report->attachments->map(function ($att) {
                return [
                    'id'         => $att->id,
                    'file_name'  => $att->file_name,
                    'file_type'  => $att->file_type,
                    'file_size'  => $att->file_size,
                    'human_size' => $att->human_size,
                    'is_image'   => $att->is_image,
                    'url'        => $att->url,
                ];
            }),
            'comments'           => $report->comments,
            'statusLogs'         => $report->statusLogs,
            'availableOperators' => $availableOperators,
            'allowedTransitions' => $allowedTransitions,
            'statuses'           => Report::STATUS_LABELS,
            'priorities'         => Report::PRIORITY_LABELS,
            'units'              => Unit::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the status of a report with transition validation.
     */
    public function updateStatus(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', Report::STATUSES)],
            'notes'  => ['nullable', 'string', 'max:1000'],
            'rejection_reason' => ['nullable', 'required_if:status,ditolak', 'string', 'max:1000'],
        ]);

        $newStatus = $validated['status'];

        // Validate status transition
        $allowedTransitions = self::STATUS_TRANSITIONS[$report->status] ?? [];
        if (!in_array($newStatus, $allowedTransitions)) {
            return back()->withErrors([
                'status' => "Transisi status dari '{$report->status}' ke '{$newStatus}' tidak diizinkan.",
            ]);
        }

        $previousStatus = $report->status;

        $updateData = ['status' => $newStatus];

        // If marking as resolved
        if ($newStatus === 'selesai') {
            $updateData['resolved_at'] = now();
        }

        // If rejecting
        if ($newStatus === 'ditolak') {
            $updateData['rejection_reason'] = $validated['rejection_reason'] ?? null;
        }

        $report->update($updateData);

        // Create status log
        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $previousStatus,
            'to_status'   => $newStatus,
            'changed_by'  => $user->id,
            'notes'       => $validated['notes'] ?? "Status diubah dari {$previousStatus} ke {$newStatus}.",
        ]);

        // Notify the reporter
        if ($report->user_id) {
            Notification::create([
                'user_id' => $report->user_id,
                'type'    => 'status_change',
                'title'   => 'Status Laporan Diperbarui',
                'message' => "Laporan #{$report->ticket_number} telah diperbarui statusnya menjadi " . (Report::STATUS_LABELS[$newStatus] ?? $newStatus) . ".",
                'data'    => [
                    'report_id'     => $report->id,
                    'ticket_number' => $report->ticket_number,
                    'from_status'   => $previousStatus,
                    'to_status'     => $newStatus,
                ],
            ]);
        }

        return back()->with('success', 'Status laporan berhasil diperbarui.');
    }

    /**
     * Assign a report to an operator.
     */
    public function assign(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
        ]);

        $operator = User::findOrFail($validated['assigned_to']);

        // Verify the assignee is an operator
        if (!in_array($operator->role, ['operator', 'admin'])) {
            return back()->withErrors([
                'assigned_to' => 'Pengguna yang dipilih bukan operator.',
            ]);
        }

        $previousAssignee = $report->assigned_to;
        $report->update(['assigned_to' => $operator->id]);

        // Create status log
        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $report->status,
            'to_status'   => $report->status,
            'changed_by'  => $user->id,
            'notes'       => "Laporan ditugaskan kepada {$operator->name}.",
        ]);

        // Notify the assigned operator
        if ($operator->id !== $user->id) {
            Notification::create([
                'user_id' => $operator->id,
                'type'    => 'assignment',
                'title'   => 'Laporan Baru Ditugaskan',
                'message' => "Anda ditugaskan untuk menangani laporan #{$report->ticket_number}.",
                'data'    => [
                    'report_id'     => $report->id,
                    'ticket_number' => $report->ticket_number,
                ],
            ]);
        }

        return back()->with('success', "Laporan berhasil ditugaskan kepada {$operator->name}.");
    }

    /**
     * Set the priority of a report.
     */
    public function setPriority(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'priority' => ['required', 'string', 'in:' . implode(',', Report::PRIORITIES)],
        ]);

        $previousPriority = $report->priority;
        $report->update(['priority' => $validated['priority']]);

        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $report->status,
            'to_status'   => $report->status,
            'changed_by'  => $user->id,
            'notes'       => "Prioritas diubah dari {$previousPriority} ke {$validated['priority']}.",
        ]);

        return back()->with('success', 'Prioritas laporan berhasil diperbarui.');
    }

    /**
     * Set the deadline for a report.
     */
    public function setDeadline(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'deadline' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $report->update(['deadline' => $validated['deadline']]);

        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $report->status,
            'to_status'   => $report->status,
            'changed_by'  => $user->id,
            'notes'       => "Tenggat waktu ditetapkan: {$validated['deadline']}.",
        ]);

        return back()->with('success', 'Tenggat waktu laporan berhasil ditetapkan.');
    }

    /**
     * Forward a report to another unit.
     */
    public function forward(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'unit_id' => ['required', 'exists:units,id'],
            'notes'   => ['nullable', 'string', 'max:1000'],
        ]);

        $targetUnit = Unit::findOrFail($validated['unit_id']);

        if ($report->unit_id === $targetUnit->id) {
            return back()->withErrors([
                'unit_id' => 'Laporan sudah berada di unit yang dipilih.',
            ]);
        }

        $previousStatus = $report->status;
        $previousUnit = $report->unit;

        $report->update([
            'unit_id'     => $targetUnit->id,
            'status'      => 'diteruskan',
            'assigned_to' => null, // Reset assignment when forwarding
        ]);

        $forwardNotes = $validated['notes']
            ? "Diteruskan ke {$targetUnit->name}: {$validated['notes']}"
            : "Diteruskan ke {$targetUnit->name}.";

        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $previousStatus,
            'to_status'   => 'diteruskan',
            'changed_by'  => $user->id,
            'notes'       => $forwardNotes,
        ]);

        // Notify the reporter
        if ($report->user_id) {
            Notification::create([
                'user_id' => $report->user_id,
                'type'    => 'forwarded',
                'title'   => 'Laporan Diteruskan',
                'message' => "Laporan #{$report->ticket_number} telah diteruskan ke {$targetUnit->name}.",
                'data'    => [
                    'report_id'     => $report->id,
                    'ticket_number' => $report->ticket_number,
                    'from_unit'     => $previousUnit?->name,
                    'to_unit'       => $targetUnit->name,
                ],
            ]);
        }

        return back()->with('success', "Laporan berhasil diteruskan ke {$targetUnit->name}.");
    }

    /**
     * Add a comment to a report (can be internal or public).
     */
    public function addComment(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'content'     => ['required', 'string', 'min:3', 'max:5000'],
            'is_internal' => ['boolean'],
        ]);

        ReportComment::create([
            'report_id'   => $report->id,
            'user_id'     => $user->id,
            'content'     => $validated['content'],
            'is_internal' => $validated['is_internal'] ?? false,
            'type'        => 'comment',
        ]);

        // Notify reporter if the comment is public
        if (!($validated['is_internal'] ?? false) && $report->user_id) {
            Notification::create([
                'user_id' => $report->user_id,
                'type'    => 'comment',
                'title'   => 'Komentar Baru',
                'message' => "Ada komentar baru pada laporan #{$report->ticket_number}.",
                'data'    => [
                    'report_id'     => $report->id,
                    'ticket_number' => $report->ticket_number,
                ],
            ]);
        }

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    /**
     * Upload a response attachment to a report.
     */
    public function addResponseAttachment(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        $this->authorizeOperatorAccess($user, $report);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx', 'max:10240'], // 10MB
        ]);

        $file = $request->file('file');
        $path = $file->store(
            'attachments/' . $report->id . '/responses',
            'public'
        );

        ReportAttachment::create([
            'report_id' => $report->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return back()->with('success', 'Dokumen tanggapan berhasil diunggah.');
    }

    /**
     * Authorize that the operator has access to this report.
     */
    private function authorizeOperatorAccess(User $user, Report $report): void
    {
        // Admins can access all reports
        if ($user->role === 'admin') {
            return;
        }

        // Operators can only access reports from their unit
        if ($user->role === 'operator' && $user->unit_id && $report->unit_id !== $user->unit_id) {
            abort(403, 'Anda tidak memiliki akses ke laporan unit lain.');
        }
    }
}
