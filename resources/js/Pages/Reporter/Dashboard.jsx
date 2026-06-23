import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({
    stats = { total_reports: 0, status_counts: {} },
    recentReports = [],
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const sc = stats.status_counts || {};

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="page-container">
                {/* Welcome */}
                <div className="welcome-banner">
                    <div className="welcome-banner-content">
                        <h2 className="welcome-title">
                            Selamat datang, <span className="welcome-name">{user.name}</span>! 👋
                        </h2>
                        <p className="welcome-subtitle">
                            Pantau status laporan Anda dan sampaikan aspirasi baru kapan saja.
                        </p>
                    </div>
                    <div className="welcome-action">
                        <Link href={route('reporter.reports.create')} className="btn btn-primary">
                            <span>📝</span> Buat Laporan Baru
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <StatsCard
                        icon="📋"
                        value={stats.total_reports || 0}
                        label="Total Laporan"
                        color="primary"
                    />
                    <StatsCard
                        icon="⚙️"
                        value={(sc.diproses || 0) + (sc.diverifikasi || 0)}
                        label="Sedang Diproses"
                        color="accent"
                    />
                    <StatsCard
                        icon="✅"
                        value={sc.selesai || 0}
                        label="Selesai"
                        color="secondary"
                    />
                    <StatsCard
                        icon="❌"
                        value={sc.ditolak || 0}
                        label="Ditolak"
                        color="danger"
                    />
                </div>

                {/* Recent Reports */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Laporan Terbaru</h3>
                        <Link href={route('reporter.reports.index')} className="card-action-link">
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="card-body">
                        {recentReports.length > 0 ? (
                            <div className="report-list">
                                {recentReports.map((report) => (
                                    <Link
                                        key={report.id}
                                        href={route('reporter.reports.show', report.id)}
                                        className="report-list-item"
                                    >
                                        <div className="report-list-item-main">
                                            <span className="report-ticket">{report.ticket_number}</span>
                                            <h4 className="report-title">{report.title}</h4>
                                            <div className="report-meta">
                                                <span className="report-category">{report.category?.name || '-'}</span>
                                                <span className="report-date">
                                                    {report.created_at
                                                        ? new Date(report.created_at).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="report-list-item-status">
                                            <StatusBadge status={report.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-inline">
                                <p>📭 Anda belum memiliki laporan.</p>
                                <Link href={route('reporter.reports.create')} className="btn btn-sm btn-primary">
                                    Buat Laporan Pertama
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
