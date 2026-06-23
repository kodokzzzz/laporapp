import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';

export default function Dashboard({
    stats = {},
    approachingSla = [],
    weeklyTrend = [],
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout header="Operator Dashboard">
            <Head title="Operator Dashboard" />

            <div className="page-container">
                <div className="welcome-banner">
                    <div className="welcome-banner-content">
                        <h2 className="welcome-title">
                            Operator Panel, <span className="welcome-name">{user.name}</span> 🛠️
                        </h2>
                        <p className="welcome-subtitle">
                            Kelola dan tindak lanjuti laporan masyarakat yang masuk ke unit Anda.
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatsCard icon="📥" value={stats.new_reports || 0} label="Laporan Baru" color="accent" />
                    <StatsCard icon="⚙️" value={stats.processing || 0} label="Sedang Diproses" color="primary" />
                    <StatsCard icon="✅" value={stats.completed_month || 0} label="Selesai Bulan Ini" color="secondary" />
                </div>

                {approachingSla.length > 0 && (
                    <div className="card mt-xl">
                        <div className="card-header">
                            <h3 className="card-title">⚠️ Mendekati Batas SLA</h3>
                            <Link href={route('operator.reports.index')} className="card-action-link">
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="report-list">
                                {approachingSla.map((report) => (
                                    <Link key={report.id} href={route('operator.reports.show', report.id)} className="report-list-item">
                                        <div className="report-list-item-main">
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span className="report-ticket">{report.ticket_number}</span>
                                                <PriorityBadge priority={report.priority} />
                                            </div>
                                            <h4 className="report-title">{report.title}</h4>
                                        </div>
                                        <StatusBadge status={report.status} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="card mt-xl">
                    <div className="card-header">
                        <h3 className="card-title">Kelola Laporan</h3>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href={route('operator.reports.index')} className="btn btn-outline">📋 Lihat Semua Laporan</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
