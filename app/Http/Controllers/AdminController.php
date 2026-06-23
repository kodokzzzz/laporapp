<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Report;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard with comprehensive analytics.
     */
    public function dashboard(): Response
    {
        $totalReports = Report::count();

        // Reports by status
        $byStatus = Report::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Reports by category (top 10)
        $byCategory = Category::withCount('reports')
            ->orderByDesc('reports_count')
            ->limit(10)
            ->get()
            ->map(fn ($cat) => [
                'name'  => $cat->name,
                'count' => $cat->reports_count,
            ]);

        // Reports by unit
        $byUnit = Unit::withCount('reports')
            ->orderByDesc('reports_count')
            ->get()
            ->map(fn ($unit) => [
                'name'  => $unit->name,
                'count' => $unit->reports_count,
            ]);

        // Daily trend for the last 30 days
        $dailyTrend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dailyTrend[] = [
                'date'  => $date->format('d M'),
                'count' => Report::whereDate('created_at', $date->toDateString())->count(),
            ];
        }

        // Weekly trend for the last 12 weeks
        $weeklyTrend = [];
        for ($i = 11; $i >= 0; $i--) {
            $start = Carbon::now()->subWeeks($i)->startOfWeek();
            $end   = Carbon::now()->subWeeks($i)->endOfWeek();
            $weeklyTrend[] = [
                'week'  => $start->format('d M') . ' - ' . $end->format('d M'),
                'count' => Report::whereBetween('created_at', [$start, $end])->count(),
            ];
        }

        // Monthly trend for the last 12 months
        $monthlyTrend = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthlyTrend[] = [
                'month' => $month->format('M Y'),
                'count' => Report::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }

        // Average resolution time (days)
        $avgResolutionTime = Report::whereNotNull('resolved_at')
            ->selectRaw('AVG(JULIANDAY(resolved_at) - JULIANDAY(created_at)) as avg_days')
            ->value('avg_days');

        // Unit performance comparison
        $unitPerformance = Unit::with(['reports' => function ($q) {
            $q->select('id', 'unit_id', 'status', 'created_at', 'resolved_at');
        }])->get()->map(function ($unit) {
            $reports = $unit->reports;
            $total = $reports->count();
            $completed = $reports->where('status', 'selesai')->count();
            $resolvedReports = $reports->whereNotNull('resolved_at');

            $avgDays = 0;
            if ($resolvedReports->count() > 0) {
                $totalDays = $resolvedReports->sum(function ($r) {
                    return $r->resolved_at->diffInDays($r->created_at);
                });
                $avgDays = round($totalDays / $resolvedReports->count(), 1);
            }

            return [
                'name'              => $unit->name,
                'total_reports'     => $total,
                'completed'         => $completed,
                'completion_rate'   => $total > 0 ? round(($completed / $total) * 100, 1) : 0,
                'avg_resolution'    => $avgDays,
                'sla_days'          => $unit->sla_days,
            ];
        });

        // Recent activity (latest 10 reports)
        $recentReports = Report::with(['category:id,name', 'unit:id,name', 'user:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'id'             => $r->id,
                'ticket_number'  => $r->ticket_number,
                'title'          => $r->title,
                'status'         => $r->status,
                'status_label'   => $r->status_label,
                'priority'       => $r->priority,
                'priority_label' => $r->priority_label,
                'category'       => $r->category,
                'unit'           => $r->unit,
                'user'           => $r->is_anonymous ? null : $r->user,
                'created_at'     => $r->created_at->toISOString(),
            ]);

        // Counts for quick stats
        $totalUsers = User::count();
        $totalOperators = User::where('role', 'operator')->count();
        $overdueReports = Report::overdue()->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_reports'       => $totalReports,
                'total_users'         => $totalUsers,
                'total_operators'     => $totalOperators,
                'overdue_reports'     => $overdueReports,
                'avg_resolution_days' => $avgResolutionTime ? round($avgResolutionTime, 1) : 0,
                'by_status'           => $byStatus,
                'by_category'         => $byCategory,
                'by_unit'             => $byUnit,
            ],
            'trends' => [
                'daily'   => $dailyTrend,
                'weekly'  => $weeklyTrend,
                'monthly' => $monthlyTrend,
            ],
            'unitPerformance' => $unitPerformance,
            'recentReports'   => $recentReports,
        ]);
    }

    /**
     * List all reports with comprehensive filtering for admin.
     */
    public function reports(Request $request): Response
    {
        $query = Report::with([
            'category:id,name,icon',
            'unit:id,name',
            'user:id,name,email',
            'assignee:id,name',
        ]);

        // Filter: status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter: category
        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Filter: unit
        if ($request->filled('unit')) {
            $query->where('unit_id', $request->input('unit'));
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

        // Filter: overdue only
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Filter: assigned / unassigned
        if ($request->filled('assignment')) {
            if ($request->input('assignment') === 'assigned') {
                $query->whereNotNull('assigned_to');
            } elseif ($request->input('assignment') === 'unassigned') {
                $query->whereNull('assigned_to');
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortBy = $request->input('sort', 'created_at');
        $sortDir = $request->input('direction', 'desc');
        $allowedSorts = ['created_at', 'title', 'status', 'priority', 'ticket_number', 'deadline', 'resolved_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'reports'    => $reports,
            'filters'    => $request->only(['status', 'category', 'unit', 'priority', 'date_from', 'date_to', 'search', 'sort', 'direction', 'overdue', 'assignment']),
            'statuses'   => Report::STATUS_LABELS,
            'priorities' => Report::PRIORITY_LABELS,
            'categories' => Category::active()->ordered()->get(['id', 'name']),
            'units'      => Unit::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
