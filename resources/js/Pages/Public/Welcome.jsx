import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

const FAQ_ITEMS = [
    {
        q: 'Apa itu LAPOR! STKIP Andi Matappa?',
        a: 'LAPOR! adalah platform resmi untuk menyampaikan aspirasi dan pengaduan bagi civitas akademika STKIP Andi Matappa secara mudah, cepat, dan transparan.',
    },
    {
        q: 'Bagaimana cara membuat laporan?',
        a: 'Anda cukup mendaftar akun, login, lalu klik "Buat Laporan". Isi formulir dengan lengkap termasuk judul, deskripsi, dan kategori laporan Anda.',
    },
    {
        q: 'Apakah laporan saya bersifat rahasia?',
        a: 'Ya, Anda dapat memilih untuk membuat laporan secara anonim. Identitas pelapor dilindungi dan hanya dapat diakses oleh petugas yang berwenang.',
    },
    {
        q: 'Berapa lama laporan saya akan ditanggapi?',
        a: 'Setiap laporan akan diverifikasi dalam 1x24 jam dan ditanggapi sesuai SLA masing-masing unit kerja, umumnya 3-14 hari kerja.',
    },
    {
        q: 'Bagaimana cara memantau status laporan?',
        a: 'Anda dapat memantau melalui menu "Laporan Saya" setelah login, atau gunakan fitur "Cek Status" di halaman utama dengan memasukkan nomor tiket.',
    },
];

export default function Welcome({ stats = {} }) {
    const { auth } = usePage().props;
    const [openFaq, setOpenFaq] = useState(null);

    const isLoggedIn = auth && auth.user;

    return (
        <GuestLayout>
            <Head title="Beranda — LAPOR!" />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-shapes">
                    <div className="hero-shape hero-shape-1" />
                    <div className="hero-shape hero-shape-2" />
                    <div className="hero-shape hero-shape-3" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">🇮🇩 Platform Pengaduan Resmi</div>
                    <h1 className="hero-title">
                        Layanan Aspirasi dan
                        <span className="hero-title-highlight"> Pengaduan Online</span>
                    </h1>
                    <p className="hero-subtitle">
                        Sampaikan aspirasi dan pengaduan Anda di lingkungan kampus STKIP Andi Matappa secara mudah, cepat, transparan, dan dapat dipantau perkembangannya.
                    </p>
                    <div className="hero-actions">
                        {isLoggedIn ? (
                            <Link href={route('dashboard')} className="btn-hero-primary">
                                <span>📊</span> Ke Dashboard
                            </Link>
                        ) : (
                            <Link href={route('public.reports.create')} className="btn-hero-primary">
                                <span>📝</span> Buat Laporan
                            </Link>
                        )}
                        <Link href="/check-status" className="btn-hero-secondary">
                            <span>🔍</span> Cek Status Laporan
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="public-stats-section">
                <div className="public-stats-grid">
                    <div className="public-stat-card">
                        <div className="public-stat-icon">📊</div>
                        <div className="public-stat-value">{(stats.total_reports || 0).toLocaleString('id-ID')}</div>
                        <div className="public-stat-label">Total Laporan Masuk</div>
                    </div>
                    <div className="public-stat-card">
                        <div className="public-stat-icon">✅</div>
                        <div className="public-stat-value">{(stats.completed_reports || 0).toLocaleString('id-ID')}</div>
                        <div className="public-stat-label">Laporan Selesai</div>
                    </div>
                    <div className="public-stat-card">
                        <div className="public-stat-icon">⏱️</div>
                        <div className="public-stat-value">{stats.avg_resolution_days || 0}</div>
                        <div className="public-stat-label">Rata-rata Hari Penanganan</div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-it-works-section">
                <h2 className="section-title">Bagaimana Cara Kerjanya?</h2>
                <p className="section-subtitle">Proses pelaporan yang mudah dan transparan dalam 3 langkah sederhana</p>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">📝</div>
                        <h3 className="step-title">Buat Laporan</h3>
                        <p className="step-desc">Daftarkan akun dan sampaikan laporan Anda dengan mengisi formulir yang tersedia secara lengkap.</p>
                    </div>
                    <div className="step-connector">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">⚙️</div>
                        <h3 className="step-title">Diproses</h3>
                        <p className="step-desc">Laporan Anda akan diverifikasi dan diteruskan ke instansi terkait untuk ditindaklanjuti.</p>
                    </div>
                    <div className="step-connector">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">🎉</div>
                        <h3 className="step-title">Selesai</h3>
                        <p className="step-desc">Pantau perkembangan dan dapatkan tanggapan resmi. Anda dinotifikasi saat laporan selesai.</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
                <p className="section-subtitle">Temukan jawaban untuk pertanyaan umum seputar LAPOR! STKIP Andi Matappa</p>
                <div className="faq-list">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div key={idx} className={`faq-item ${openFaq === idx ? 'faq-item-open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                                <span>{item.q}</span>
                                <svg
                                    className={`faq-chevron ${openFaq === idx ? 'faq-chevron-open' : ''}`}
                                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            {openFaq === idx && (
                                <div className="faq-answer !max-h-none">
                                    <div className="p-4 mb-2 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-emerald-400"></div>
                                        <p className="pl-2 text-gray-700 leading-relaxed font-medium m-0">{item.a}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </GuestLayout>
    );
}
