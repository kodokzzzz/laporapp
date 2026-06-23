/**
 * EmptyState Component
 *
 * Displays a centered empty state placeholder with an icon, title,
 * description text, and an optional action button (using Inertia Link).
 *
 * @param {string} icon - Emoji or string icon to display
 * @param {string} title - Main heading text
 * @param {string} description - Supporting description text
 * @param {Object} action - Optional action: { label: string, href: string, onClick: func }
 * @param {string} className - Additional CSS classes
 */

import { Link } from '@inertiajs/react';

export default function EmptyState({
    icon = '📭',
    title = 'Tidak ada data',
    description = 'Belum ada data yang tersedia saat ini.',
    action,
    className = '',
}) {
    return (
        <div className={`empty-state ${className}`.trim()}>
            <div className="empty-state-icon">{icon}</div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {action && (
                <div className="empty-state-action">
                    {action.href ? (
                        <Link href={action.href} className="empty-state-button">
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="empty-state-button"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
