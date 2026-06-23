<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Notification;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\ReportComment;
use App\Models\ReportStatusLog;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReporterController extends Controller
{
    /**
     * Display reporter's dashboard with personal report statistics.
     */
    public function dashboard(): Response
    {
        $user = Auth::user();

        $totalReports = Report::where('user_id', $user->id)->count();

        $statusCounts = Report::where('user_id', $user->id)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $recentReports = Report::where('user_id', $user->id)
            ->with(['category:id,name,icon', 'unit:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id'             => $report->id,
                    'ticket_number'  => $report->ticket_number,
                    'title'          => $report->title,
                    'status'         => $report->status,
                    'status_label'   => $report->status_label,
                    'priority'       => $report->priority,
                    'priority_label' => $report->priority_label,
                    'category'       => $report->category,
                    'unit'           => $report->unit,
                    'created_at'     => $report->created_at->toISOString(),
                ];
            });

        return Inertia::render('Reporter/Dashboard', [
            'stats' => [
                'total_reports'  => $totalReports,
                'status_counts'  => $statusCounts,
            ],
            'recentReports' => $recentReports,
        ]);
    }

    /**
     * List the reporter's own reports with filters and pagination.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $query = Report::where('user_id', $user->id)
            ->with(['category:id,name,icon', 'unit:id,name']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Search by title or ticket number
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%");
            });
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Reporter/Reports/Index', [
            'reports'    => $reports,
            'filters'    => $request->only(['status', 'category', 'search']),
            'statuses'   => Report::STATUS_LABELS,
            'categories' => Category::active()->ordered()->get(['id', 'name']),
        ]);
    }

    /**
     * Show the create report form with available categories and units.
     */
    public function create(): Response
    {
        return Inertia::render('Reporter/Reports/Create', [
            'categories' => Category::active()->ordered()->get(['id', 'name', 'icon', 'description']),
            'units'      => Unit::active()->orderBy('name')->get(['id', 'name', 'description']),
        ]);
    }

    /**
     * Store a newly created report.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'         => ['required', 'string', 'max:150'],
            'description'   => ['required', 'string', 'min:20'],
            'category_id'   => ['required', 'exists:categories,id'],
            'unit_id'       => ['nullable', 'exists:units,id'],
            'is_anonymous'  => ['boolean'],
            'location'      => ['nullable', 'string', 'max:255'],
            'incident_date' => ['nullable', 'date', 'before_or_equal:today'],
            'attachments'   => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx', 'max:5120'], // 5MB each
        ]);

        $user = Auth::user();

        // Create the report
        $report = Report::create([
            'title'         => $validated['title'],
            'description'   => $validated['description'],
            'category_id'   => $validated['category_id'],
            'unit_id'       => $validated['unit_id'] ?? null,
            'user_id'       => $user->id,
            'is_anonymous'  => $validated['is_anonymous'] ?? false,
            'location'      => $validated['location'] ?? null,
            'incident_date' => $validated['incident_date'] ?? null,
            'status'        => 'diterima',
            'priority'      => 'sedang',
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store(
                    'attachments/' . $report->id,
                    'public'
                );

                ReportAttachment::create([
                    'report_id' => $report->id,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        // Create initial status log
        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => null,
            'to_status'   => 'diterima',
            'changed_by'  => $user->id,
            'notes'       => 'Laporan berhasil dikirim.',
        ]);

        return redirect()
            ->route('reporter.reports.show', $report)
            ->with('success', 'Laporan berhasil dikirim! Nomor tiket Anda: ' . $report->ticket_number);
    }

    /**
     * Display a specific report owned by the reporter.
     */
    public function show(Report $report): Response
    {
        $user = Auth::user();

        // Authorization: ensure the report belongs to the authenticated user
        if ($report->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        $report->load([
            'category:id,name,icon',
            'unit:id,name',
            'assignee:id,name',
            'attachments',
            'comments' => function ($query) {
                // Reporter should only see non-internal (public) comments
                $query->where('is_internal', false)
                    ->with('user:id,name,role,avatar')
                    ->orderBy('created_at', 'asc');
            },
            'statusLogs' => function ($query) {
                $query->with('changedBy:id,name,role')
                    ->orderBy('created_at', 'asc');
            },
        ]);

        return Inertia::render('Reporter/Reports/Show', [
            'report'      => $report,
            'attachments' => $report->attachments->map(function ($attachment) {
                return [
                    'id'         => $attachment->id,
                    'file_name'  => $attachment->file_name,
                    'file_type'  => $attachment->file_type,
                    'file_size'  => $attachment->file_size,
                    'human_size' => $attachment->human_size,
                    'is_image'   => $attachment->is_image,
                    'url'        => $attachment->url,
                ];
            }),
            'comments'    => $report->comments,
            'statusLogs'  => $report->statusLogs,
            'statuses'    => Report::STATUS_LABELS,
        ]);
    }

    /**
     * Add a comment from the reporter to a report.
     */
    public function addComment(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        if ($report->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:5', 'max:2000'],
        ]);

        ReportComment::create([
            'report_id'   => $report->id,
            'user_id'     => $user->id,
            'content'     => $validated['content'],
            'is_internal' => false,
            'type'        => 'comment',
        ]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    /**
     * Reporter confirms the report is resolved.
     */
    public function markResolved(Report $report): RedirectResponse
    {
        $user = Auth::user();

        if ($report->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        // Can only confirm resolution if status is 'selesai' or 'diproses'
        if (!in_array($report->status, ['selesai', 'diproses'])) {
            return back()->withErrors([
                'status' => 'Laporan tidak dalam status yang dapat dikonfirmasi selesai.',
            ]);
        }

        $previousStatus = $report->status;

        $report->update([
            'status'      => 'selesai',
            'resolved_at' => now(),
        ]);

        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $previousStatus,
            'to_status'   => 'selesai',
            'changed_by'  => $user->id,
            'notes'       => 'Pelapor mengkonfirmasi laporan telah selesai.',
        ]);

        return back()->with('success', 'Terima kasih! Laporan telah dikonfirmasi selesai.');
    }

    /**
     * Reporter escalates a report.
     */
    public function escalate(Request $request, Report $report): RedirectResponse
    {
        $user = Auth::user();

        if ($report->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke laporan ini.');
        }

        // Can only escalate if report is in certain statuses
        if (!in_array($report->status, ['diterima', 'diverifikasi', 'diproses'])) {
            return back()->withErrors([
                'status' => 'Laporan tidak dalam status yang dapat dieskalasi.',
            ]);
        }

        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $previousStatus = $report->status;
        $reason = $request->input('reason', 'Pelapor melakukan eskalasi laporan.');

        // Upgrade priority
        $priorityUpgrade = [
            'rendah'   => 'sedang',
            'sedang'   => 'tinggi',
            'tinggi'   => 'mendesak',
            'mendesak' => 'mendesak',
        ];

        $report->update([
            'priority' => $priorityUpgrade[$report->priority] ?? 'tinggi',
        ]);

        ReportStatusLog::create([
            'report_id'   => $report->id,
            'from_status' => $previousStatus,
            'to_status'   => $previousStatus, // Status doesn't change, priority does
            'changed_by'  => $user->id,
            'notes'       => 'Eskalasi oleh pelapor: ' . $reason,
        ]);

        // Create comment to record the escalation
        ReportComment::create([
            'report_id'   => $report->id,
            'user_id'     => $user->id,
            'content'     => 'Laporan dieskalasi: ' . $reason,
            'is_internal' => false,
            'type'        => 'comment',
        ]);

        // Notify assigned operator if exists
        if ($report->assigned_to) {
            Notification::create([
                'user_id' => $report->assigned_to,
                'type'    => 'escalation',
                'title'   => 'Laporan Dieskalasi',
                'message' => "Laporan #{$report->ticket_number} telah dieskalasi oleh pelapor.",
                'data'    => [
                    'report_id'     => $report->id,
                    'ticket_number' => $report->ticket_number,
                ],
            ]);
        }

        return back()->with('success', 'Laporan telah dieskalasi. Prioritas dinaikkan.');
    }
}
