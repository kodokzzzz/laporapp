import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React from 'react';

export default function Statistics({ stats, statuses }) {
    const total = stats.total_reports || 0;
    
    // Status metrics
    const statusKeys = Object.keys(statuses || {});
    
    return (
        <GuestLayout>
            <Head title="Statistik Laporan — LAPOR!" />

            <div className="page-container" style={{ padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Statistik & Kinerja Laporan
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Transparansi adalah kunci. Berikut adalah gambaran komprehensif dari semua laporan yang masuk, status terkini, dan kinerja penyelesaian kami.
                    </p>
                </div>

                {/* Highlight Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="card shadow-lg" style={{ borderTop: '4px solid var(--primary)', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Laporan Masuk</div>
                        <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
                            {total}
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Keseluruhan pengaduan dan aspirasi</p>
                    </div>

                    <div className="card shadow-lg" style={{ borderTop: '4px solid var(--success)', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Rata-rata Waktu Penyelesaian</div>
                        <div style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
                            {stats.avg_resolution_days} <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Hari</span>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Dihitung dari laporan yang sudah selesai</p>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="card shadow-md">
                    <div className="card-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Distribusi Berdasarkan Status</h2>
                    </div>
                    <div className="card-body" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {statusKeys.map(key => {
                                const count = stats.by_status[key] || 0;
                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                                const label = statuses[key];
                                
                                let color = 'var(--primary)';
                                if (key === 'selesai') color = 'var(--success)';
                                if (key === 'ditolak') color = 'var(--danger)';
                                if (key === 'diverifikasi') color = '#f59e0b';
                                if (key === 'diterima') color = '#64748b';

                                return (
                                    <div key={key}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '500' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{label}</span>
                                            <span style={{ fontWeight: '700' }}>{count} ({percentage}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '12px', background: 'var(--gray-200)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div 
                                                style={{ 
                                                    width: `${percentage}%`, 
                                                    height: '100%', 
                                                    background: color,
                                                    transition: 'width 1s ease-in-out'
                                                }} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
