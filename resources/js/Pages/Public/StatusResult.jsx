import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import StatusBadge from '@/Components/StatusBadge';
import Timeline from '@/Components/Timeline';

export default function StatusResult({ report, timeline = [], error }) {
    if (!report) {
        return (
            <GuestLayout>
                <Head title="Laporan Tidak Ditemukan — LAPOR!" />
                <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem 1rem' }}>
                    <div className="card shadow-xl" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem', borderTop: '4px solid var(--danger)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
                        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                            Laporan Tidak Ditemukan
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                            {error || 'Nomor tiket yang Anda masukkan tidak ditemukan dalam sistem kami. Pastikan nomor tiket sudah benar dan dicetak dengan huruf kapital.'}
                        </p>
                        <Link href={route('check-status')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            ← Coba Lagi
                        </Link>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title={`Status: ${report.ticket_number} — LAPOR!`} />

            <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link href={route('check-status')} className="text-secondary" style={{ textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>←</span> Kembali ke Pencarian
                    </Link>
                </div>

                <div className="card shadow-xl">
                    {/* Header */}
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Nomor Tiket</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{report.ticket_number}</div>
                        </div>
                        <StatusBadge status={report.status} />
                    </div>

                    {/* Report Details */}
                    <div className="card-body">
                        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            {report.title}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.25rem' }}>🏷️</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Kategori</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{report.category?.name || '-'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.25rem' }}>🏢</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Unit Tujuan</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{report.unit?.name || '-'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ fontSize: '1.25rem' }}>📅</div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Tanggal Laporan</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {report.created_at
                                            ? new Date(report.created_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {report.description && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Isi Laporan</h3>
                                <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {report.description}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        {report.status_logs && report.status_logs.length > 0 && (
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Riwayat Status & Tindak Lanjut</h3>
                                
                                <Timeline 
                                    items={report.status_logs.map(log => ({
                                        status: log.to_status,
                                        date: log.created_at,
                                        user: log.changed_by,
                                        notes: log.notes,
                                        type: 'status_change'
                                    }))} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
