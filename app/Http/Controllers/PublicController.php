<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PublicController extends Controller
{
    /**
     * Display the public welcome/landing page with aggregate stats.
     */
    public function index(): Response
    {
        $totalReports = Report::count();
        $completedReports = Report::where('status', 'selesai')->count();

        // Average resolution time in days (from created_at to resolved_at)
        $avgResolutionDays = Report::whereNotNull('resolved_at')
            ->selectRaw('AVG(JULIANDAY(resolved_at) - JULIANDAY(created_at)) as avg_days')
            ->value('avg_days');

        $categoriesCount = Category::where('is_active', true)->count();

        return Inertia::render('Public/Welcome', [
            'stats' => [
                'total_reports'      => $totalReports,
                'completed_reports'  => $completedReports,
                'avg_resolution_days' => $avgResolutionDays ? round($avgResolutionDays, 1) : 0,
                'categories_count'   => $categoriesCount,
            ],
        ]);
    }

    /**
     * Show the public reporting form.
     */
    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Public/CreateReport', [
            'categories' => $categories,
            'types' => Report::TYPE_LABELS,
        ]);
    }

    /**
     * Store a new public report.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type'          => ['required', 'string', 'in:pengaduan,aspirasi,permintaan_informasi'],
            'title'         => ['required', 'string', 'max:150'],
            'description'   => ['required', 'string'],
            'category_id'   => ['required', 'exists:categories,id'],
            'location'      => ['nullable', 'string', 'max:255'],
            'incident_date' => ['nullable', 'date'],
            'is_anonymous'  => ['boolean'],
            'is_secret'     => ['boolean'],
            // Guest info
            'guest_name'    => ['nullable', 'string', 'max:255'],
            'guest_email'   => ['nullable', 'email', 'max:255'],
            'guest_phone'   => ['nullable', 'string', 'max:20'],
        ]);

        // If user is logged in, attach their ID. Otherwise, it remains null.
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        $report = Report::create($validated);

        return redirect()->route('public.reports.success')->with([
            'success' => true,
            'ticket_number' => $report->ticket_number,
        ]);
    }

    /**
     * Show the success page after public reporting.
     */
    public function success(): Response|RedirectResponse
    {
        // Only allow access if redirected from store with a ticket number
        $ticketNumber = session('ticket_number');

        if (!$ticketNumber) {
            return redirect()->route('public.reports.create');
        }

        return Inertia::render('Public/ReportSuccess', [
            'ticket_number' => $ticketNumber,
        ]);
    }

    /**
     * Display the check status page.
     */
    public function checkStatus(): Response
    {
        return Inertia::render('Public/CheckStatus');
    }

    /**
     * Search for a report by ticket number and return its status.
     * Does NOT reveal reporter identity.
     */
    public function getStatus(Request $request): Response
    {
        $request->validate([
            'ticket_number' => ['required', 'string', 'max:30'],
        ]);

        $ticketNumber = trim($request->input('ticket_number'));

        $report = Report::where('ticket_number', $ticketNumber)
            ->with([
                'category:id,name,icon',
                'unit:id,name',
                'statusLogs' => function ($query) {
                    $query->with('changedBy:id,name,role')
                        ->orderBy('created_at', 'asc');
                },
            ])
            ->first();

        if (!$report) {
            return Inertia::render('Public/StatusResult', [
                'report' => null,
                'error'  => 'Laporan dengan nomor tiket tersebut tidak ditemukan.',
            ]);
        }

        // Return only safe, non-identifying data
        return Inertia::render('Public/StatusResult', [
            'report' => [
                'ticket_number' => $report->ticket_number,
                'title'         => $report->title,
                'status'        => $report->status,
                'status_label'  => $report->status_label,
                'priority'      => $report->priority,
                'priority_label' => $report->priority_label,
                'category'      => $report->category ? [
                    'name' => $report->category->name,
                    'icon' => $report->category->icon,
                ] : null,
                'unit'          => $report->unit ? [
                    'name' => $report->unit->name,
                ] : null,
                'created_at'    => $report->created_at->toISOString(),
                'resolved_at'   => $report->resolved_at?->toISOString(),
                'status_logs'   => $report->statusLogs->map(function ($log) {
                    return [
                        'from_status' => $log->from_status,
                        'to_status'   => $log->to_status,
                        'notes'       => $log->notes,
                        'created_at'  => $log->created_at->toISOString(),
                        'changed_by'  => $log->changedBy ? [
                            'name' => $log->changedBy->name,
                        ] : null,
                    ];
                }),
            ],
            'error' => null,
        ]);
    }

    /**
     * Display public statistics.
     */
    public function statistics(): Response
    {
        $totalReports = Report::count();
        
        $statusCounts = Report::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->toArray();
            
        // Average resolution time in days (from created_at to resolved_at)
        $avgResolutionDays = Report::whereNotNull('resolved_at')
            ->selectRaw('AVG(JULIANDAY(resolved_at) - JULIANDAY(created_at)) as avg_days')
            ->value('avg_days');

        return Inertia::render('Public/Statistics', [
            'stats' => [
                'total_reports' => $totalReports,
                'by_status'     => $statusCounts,
                'avg_resolution_days' => $avgResolutionDays ? round($avgResolutionDays, 1) : 0,
            ],
            'statuses' => Report::STATUS_LABELS,
        ]);
    }
}
