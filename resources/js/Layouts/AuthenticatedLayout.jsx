import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = {
    pelapor: [
        { label: 'Dashboard', icon: '📊', route: 'reporter.dashboard' },
        { label: 'Buat Laporan', icon: '📝', route: 'reporter.reports.create' },
        { label: 'Laporan Saya', icon: '📋', route: 'reporter.reports.index' },
        { label: 'Notifikasi', icon: '🔔', route: 'notifications.index' },
        { label: 'Profil', icon: '👤', route: 'profile.edit' },
    ],
    operator: [
        { label: 'Dashboard', icon: '📊', route: 'operator.dashboard' },
        { label: 'Laporan Masuk', icon: '📥', route: 'operator.reports.index' },
        { label: 'Notifikasi', icon: '🔔', route: 'notifications.index' },
        { label: 'Profil', icon: '👤', route: 'profile.edit' },
    ],
    admin: [
        { label: 'Dashboard', icon: '📊', route: 'admin.dashboard' },
        { label: 'Semua Laporan', icon: '📋', route: 'admin.reports.index' },
        { label: 'Pengguna', icon: '👥', route: 'admin.users.index' },
        { label: 'Kategori', icon: '🏷️', route: 'admin.categories.index' },
        { label: 'Unit Kerja', icon: '🏢', route: 'admin.units.index' },
        { label: 'Notifikasi', icon: '🔔', route: 'notifications.index' },
        { label: 'Profil', icon: '👤', route: 'profile.edit' },
    ],
};

function isRouteActive(routeName) {
    try {
        return route().current(routeName) || route().current(routeName + '.*');
    } catch {
        return false;
    }
}

function getRouteUrl(routeName) {
    try {
        return route(routeName);
    } catch {
        return '#';
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const { auth, unreadNotifications = 0 } = usePage().props;
    const user = auth.user;
    const role = user.role || 'pelapor';
    const navItems = NAV_ITEMS[role] || NAV_ITEMS.pelapor;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const roleLabels = { pelapor: 'Pelapor', operator: 'Operator', admin: 'Administrator' };

    return (
        <div className="app-layout">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" className="sidebar-logo">
                        <span className="sidebar-logo-icon">📢</span>
                        <span className="sidebar-logo-text text-sm">LAPOR! STKIP AM</span>
                    </Link>
                    <button
                        className="sidebar-close-btn"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Tutup menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-nav-label">Menu Utama</div>
                    {navItems.map((item) => {
                        const active = isRouteActive(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={getRouteUrl(item.route)}
                                className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                <span className="sidebar-link-label">{item.label}</span>
                                {item.route === 'notifications.index' && unreadNotifications > 0 && (
                                    <span className="sidebar-link-badge">{unreadNotifications > 99 ? '99+' : unreadNotifications}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-avatar">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar-user-details">
                            <div className="sidebar-user-name">{user.name}</div>
                            <div className="sidebar-user-role">{roleLabels[role] || role}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main area */}
            <div className="main-wrapper">
                {/* Top header */}
                <header className="top-header">
                    <div className="top-header-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Buka menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        {header && <h1 className="top-header-title">{header}</h1>}
                    </div>

                    <div className="top-header-right">
                        {/* Notification bell */}
                        <Link
                            href={getRouteUrl('notifications.index')}
                            className="top-header-icon-btn"
                            title="Notifikasi"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {unreadNotifications > 0 && (
                                <span className="notification-badge-dot">
                                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </span>
                            )}
                        </Link>

                        {/* User dropdown */}
                        <div className="user-dropdown-container" ref={userDropdownRef}>
                            <button
                                className="user-dropdown-trigger"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            >
                                <div className="user-dropdown-avatar">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="user-dropdown-name">{user.name}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`user-dropdown-chevron ${userDropdownOpen ? 'rotated' : ''}`}>
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {userDropdownOpen && (
                                <div className="user-dropdown-menu">
                                    <div className="user-dropdown-header">
                                        <div className="user-dropdown-header-name">{user.name}</div>
                                        <div className="user-dropdown-header-email">{user.email}</div>
                                    </div>
                                    <div className="user-dropdown-divider" />
                                    <Link
                                        href={route('profile.edit')}
                                        className="user-dropdown-item"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <span>👤</span> Profil Saya
                                    </Link>
                                    <button
                                        className="user-dropdown-item user-dropdown-item-danger"
                                        onClick={handleLogout}
                                    >
                                        <span>🚪</span> Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
