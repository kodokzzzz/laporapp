import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLoggedIn = auth && auth.user;

    return (
        <div className="guest-layout">
            {/* Glass header */}
            <header className="guest-header">
                <div className="guest-header-inner">
                    <Link href="/" className="guest-logo">
                        <span className="guest-logo-icon">📢</span>
                        <span className="guest-logo-text">LAPOR! STKIP Andi Matappa</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="guest-nav">
                        <Link href="/" className="guest-nav-link">
                            Beranda
                        </Link>
                        <Link href="/statistik" className="guest-nav-link">
                            Statistik
                        </Link>
                        <Link href="/check-status" className="guest-nav-link">
                            Cek Status
                        </Link>
                        {isLoggedIn ? (
                            <Link href={route('dashboard')} className="guest-nav-link guest-nav-cta">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="guest-nav-link">
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="guest-nav-link guest-nav-cta">
                                    Daftar
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="guest-hamburger"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {mobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="guest-mobile-menu">
                        <Link href="/" className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            Beranda
                        </Link>
                        <Link href="/statistik" className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            Statistik
                        </Link>
                        <Link href="/check-status" className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            Cek Status
                        </Link>
                        {isLoggedIn ? (
                            <Link href={route('dashboard')} className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="guest-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="guest-main">
                {children}
            </main>

            {/* Footer */}
            <footer className="guest-footer">
                <div className="guest-footer-inner">
                    <div className="guest-footer-grid">
                        <div className="guest-footer-brand">
                            <div className="guest-footer-logo">
                                <span className="guest-logo-icon">📢</span>
                                <span className="guest-logo-text">LAPOR! STKIP AM</span>
                            </div>
                            <p className="guest-footer-desc">
                                Layanan Aspirasi dan Pengaduan Online Civitas Akademika STKIP Andi Matappa. Platform resmi untuk menyampaikan aspirasi dan keluhan.
                            </p>
                        </div>
                        <div className="guest-footer-links">
                            <h4 className="guest-footer-heading">Tautan</h4>
                            <Link href="/" className="guest-footer-link">Beranda</Link>
                            <Link href="/check-status" className="guest-footer-link">Cek Status Laporan</Link>
                            <Link href={route('login')} className="guest-footer-link">Masuk</Link>
                            <Link href={route('register')} className="guest-footer-link">Daftar</Link>
                        </div>
                        <div className="guest-footer-links">
                            <h4 className="guest-footer-heading">Informasi</h4>
                            <span className="guest-footer-link">Tentang LAPOR!</span>
                            <span className="guest-footer-link">Syarat & Ketentuan</span>
                            <span className="guest-footer-link">Kebijakan Privasi</span>
                            <span className="guest-footer-link">Kontak</span>
                        </div>
                    </div>
                    <div className="guest-footer-bottom">
                        <p>&copy; {new Date().getFullYear()} LAPOR! STKIP Andi Matappa. Seluruh hak cipta dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
