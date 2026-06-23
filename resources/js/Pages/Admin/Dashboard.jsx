import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({ stats = {}, recentReports = [] }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout header="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="page-container">
                <div className="welcome-banner">
                    <div className="welcome-banner-content">
                        <h2 className="welcome-title">Administrator Panel 🚀</h2>
                        <p className="welcome-subtitle">Ringkasan seluruh aktivitas sistem LAPOR.</p>
                    </div>
                </div>

                <div className="stats-grid grid-cols-4">
                    <StatsCard icon="📋" value={stats.total_reports || 0} label="Total Laporan" color="primary" />
                    <StatsCard icon="👥" value={stats.total_users || 0} label="Total Pengguna" color="secondary" />
                    <StatsCard icon="🛠️" value={stats.total_operators || 0} label="Total Operator" color="accent" />
                    <StatsCard icon="⏰" value={stats.overdue_reports || 0} label="Laporan Overdue" color="danger" />
                </div>

                <div className="card mt-xl">
                    <div className="card-header">
                        <h3 className="card-title">Laporan Terbaru</h3>
                        <Link href={route('admin.reports.index')} className="card-action-link">
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="card-body">
                        {recentReports.length > 0 ? (
                            <div className="report-list">
                                {recentReports.map((report) => (
                                    <Link key={report.id} href={route('operator.reports.show', report.id)} className="report-list-item">
                                        <div className="report-list-item-main">
                                            <span className="report-ticket">{report.ticket_number}</span>
                                            <h4 className="report-title">{report.title}</h4>
                                            <div className="report-meta">
                                                <span className="report-category">{report.category?.name || '-'}</span>
                                                <span>{report.unit?.name || '-'}</span>
                                            </div>
                                        </div>
                                        <StatusBadge status={report.status} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-inline">
                                <p>Belum ada laporan masuk.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 mt-xl">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Akses Cepat</h3>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link href={route('admin.users.index')} className="btn btn-outline">👥 Kelola Pengguna</Link>
                            <Link href={route('admin.units.index')} className="btn btn-outline">🏢 Kelola Unit Kerja</Link>
                            <Link href={route('admin.categories.index')} className="btn btn-outline">🏷️ Kelola Kategori</Link>
                            <Link href={route('admin.reports.index')} className="btn btn-outline">📋 Pantau Semua Laporan</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
