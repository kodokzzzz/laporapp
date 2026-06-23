import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ReportSuccess({ ticket_number }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(ticket_number);
        alert('Nomor Tiket berhasil disalin!');
    };

    return (
        <GuestLayout>
            <Head title="Laporan Berhasil — LAPOR!" />

            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '2rem 1rem' }}>
                <div className="card shadow-xl text-center" style={{ maxWidth: '600px', width: '100%', padding: '3rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Laporan Berhasil Disampaikan!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Terima kasih telah berpartisipasi. Laporan Anda telah kami terima dan akan segera diproses oleh instansi terkait. Berikut adalah Nomor Tiket Anda. <strong>Harap simpan nomor ini</strong> untuk memantau perkembangan laporan Anda.
                    </p>

                    <div style={{ background: 'var(--primary-50)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--primary-300)', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Nomor Tiket
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: '800', color: 'var(--primary-dark)', letterSpacing: '2px' }}>
                                {ticket_number}
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="btn btn-outline"
                                style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}
                                title="Salin Nomor Tiket"
                            >
                                📋
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href={route('check-status')} className="btn btn-primary btn-lg">
                            🔍 Cek Status Laporan
                        </Link>
                        <Link href={route('home')} className="btn btn-outline btn-lg">
                            🏠 Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
