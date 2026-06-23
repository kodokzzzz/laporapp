/**
 * Timeline Component
 *
 * Renders a vertical timeline showing the status history of a report.
 * Each item has a color-coded dot based on the status type, a timestamp,
 * the user who made the change, and optional notes.
 *
 * @param {Array} items - Array of timeline entries:
 *   { status: string, date: string, user: string, notes: string, type: string }
 * @param {string} className - Additional CSS classes
 */

/**
 * Maps status types to their dot color CSS modifier classes.
 * These correspond to .timeline-dot-{type} in app.css.
 */
const TYPE_COLORS = {
    diterima: 'info',
    diverifikasi: 'success',
    diproses: 'warning',
    selesai: 'success',
    ditolak: 'danger',
    diteruskan: 'info',
    catatan: 'neutral',
    default: 'neutral',
};

const STATUS_LABELS = {
    diterima: 'Laporan Diterima',
    diverifikasi: 'Laporan Diverifikasi',
    diproses: 'Sedang Diproses',
    selesai: 'Laporan Selesai',
    ditolak: 'Laporan Ditolak',
    diteruskan: 'Laporan Diteruskan',
    catatan: 'Catatan Ditambahkan',
};

const STATUS_ICONS = {
    diterima: '📥',
    diverifikasi: '✅',
    diproses: '⚙️',
    selesai: '🎉',
    ditolak: '❌',
    diteruskan: '📤',
    catatan: '📝',
};

/**
 * Formats an ISO date string into a readable Indonesian date/time.
 */
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString;
    }
}

/**
 * Calculates relative time from a date string (e.g., "2 hari yang lalu").
 */
function relativeTime(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMinutes < 1) return 'Baru saja';
        if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays < 30) return `${diffDays} hari yang lalu`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
        return `${Math.floor(diffDays / 365)} tahun yang lalu`;
    } catch {
        return '';
    }
}

function TimelineItem({ item, isLast }) {
    const type = (item.type || item.status || 'default').toLowerCase();
    const colorType = TYPE_COLORS[type] || TYPE_COLORS.default;
    const statusLabel = STATUS_LABELS[type] || item.status || 'Update';
    const icon = STATUS_ICONS[type] || '📋';

    return (
        <div className={`timeline-item ${isLast ? 'timeline-item-last' : ''}`}>
            {/* Vertical connector line */}
            {!isLast && <div className={`timeline-connector timeline-connector-${colorType}`} />}

            {/* Color-coded dot */}
            <div className={`timeline-dot timeline-dot-${colorType}`}>
                <span className="timeline-dot-icon">{icon}</span>
            </div>

            {/* Content card */}
            <div className="timeline-content">
                <div className="timeline-content-header">
                    <h4 className="timeline-content-title">{statusLabel}</h4>
                    <div className="timeline-content-meta">
                        <time
                            className="timeline-content-date"
                            dateTime={item.date}
                            title={formatDate(item.date)}
                        >
                            {relativeTime(item.date)}
                        </time>
                    </div>
                </div>

                {item.user && (
                    <div className="timeline-content-user">
                        <span className="timeline-content-user-icon">👤</span>
                        <span>{item.user}</span>
                    </div>
                )}

                {item.notes && (
                    <div className="timeline-content-notes">
                        <p>{item.notes}</p>
                    </div>
                )}

                <div className="timeline-content-timestamp">
                    {formatDate(item.date)}
                </div>
            </div>
        </div>
    );
}

export default function Timeline({ items = [], className = '' }) {
    if (!items || items.length === 0) {
        return (
            <div className={`timeline timeline-empty ${className}`.trim()}>
                <div className="timeline-empty-state">
                    <span className="timeline-empty-icon">📋</span>
                    <p className="timeline-empty-text">Belum ada riwayat aktivitas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`timeline ${className}`.trim()}>
            {items.map((item, index) => (
                <TimelineItem
                    key={item.id || `timeline-${index}`}
                    item={item}
                    isLast={index === items.length - 1}
                />
            ))}
        </div>
    );
}
