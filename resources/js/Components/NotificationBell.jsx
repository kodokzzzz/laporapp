/**
 * NotificationBell Component
 *
 * Displays a bell icon with an unread notification count badge.
 * Clicking the bell toggles a dropdown list of recent notifications.
 * Notifications are grouped by read/unread and show relative timestamps.
 *
 * @param {Array} notifications - Array of notification objects:
 *   { id, title, message, read_at, created_at, type }
 * @param {number} unreadCount - Number of unread notifications
 * @param {function} onNotificationClick - Callback when a notification is clicked
 * @param {function} onMarkAllRead - Callback to mark all as read
 * @param {string} className - Additional CSS classes
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Format relative time in Indonesian.
 */
function timeAgo(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Baru saja';
        if (diffMin < 60) return `${diffMin} menit lalu`;
        if (diffHrs < 24) return `${diffHrs} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
        return '';
    }
}

/**
 * Maps notification type to an icon.
 */
const TYPE_ICONS = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '🚨',
    report: '📋',
    comment: '💬',
    status: '🔔',
    default: '🔔',
};

export default function NotificationBell({
    notifications = [],
    unreadCount = 0,
    onNotificationClick,
    onMarkAllRead,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    /* Close dropdown when clicking outside */
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    /* Close dropdown on Escape */
    useEffect(() => {
        function handleEscape(e) {
            if (e.key === 'Escape') setIsOpen(false);
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleNotificationClick = (notification) => {
        onNotificationClick?.(notification);
        setIsOpen(false);
    };

    const handleMarkAllRead = () => {
        onMarkAllRead?.();
    };

    return (
        <div ref={containerRef} className={`notification-bell ${className}`.trim()}>
            {/* Bell button */}
            <button
                type="button"
                className="notification-bell-button"
                onClick={toggleDropdown}
                aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ''}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <svg
                    className="notification-bell-icon"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unreadCount > 0 && (
                    <span className="notification-bell-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="notification-dropdown" role="menu">
                    {/* Dropdown header */}
                    <div className="notification-dropdown-header">
                        <h4 className="notification-dropdown-title">Notifikasi</h4>
                        {unreadCount > 0 && onMarkAllRead && (
                            <button
                                type="button"
                                className="notification-dropdown-mark-all"
                                onClick={handleMarkAllRead}
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* Notification list */}
                    <div className="notification-dropdown-list">
                        {notifications.length === 0 ? (
                            <div className="notification-dropdown-empty">
                                <span className="notification-dropdown-empty-icon">🔔</span>
                                <p>Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const isUnread = !notification.read_at;
                                const type = notification.type || 'default';
                                const icon = TYPE_ICONS[type] || TYPE_ICONS.default;

                                return (
                                    <button
                                        key={notification.id}
                                        type="button"
                                        className={`notification-item ${isUnread ? 'notification-item-unread' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        role="menuitem"
                                    >
                                        <div className="notification-item-icon">{icon}</div>
                                        <div className="notification-item-content">
                                            <p className="notification-item-title">
                                                {notification.title}
                                            </p>
                                            {notification.message && (
                                                <p className="notification-item-message">
                                                    {notification.message}
                                                </p>
                                            )}
                                            <span className="notification-item-time">
                                                {timeAgo(notification.created_at)}
                                            </span>
                                        </div>
                                        {isUnread && (
                                            <span className="notification-item-dot" aria-label="Belum dibaca" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Dropdown footer */}
                    {notifications.length > 0 && (
                        <div className="notification-dropdown-footer">
                            <button
                                type="button"
                                className="notification-dropdown-view-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Lihat semua notifikasi
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
