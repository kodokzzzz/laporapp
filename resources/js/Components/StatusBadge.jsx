/**
 * StatusBadge Component
 *
 * Displays the current status of a report as a colored badge.
 * Each status maps to an Indonesian label and a corresponding CSS class
 * for color-coding (defined in app.css as .badge-status-{status}).
 *
 * @param {string} status - One of: diterima, diverifikasi, diproses, selesai, ditolak, diteruskan
 */

const STATUS_LABELS = {
    diterima: 'Diterima',
    diverifikasi: 'Diverifikasi',
    diproses: 'Sedang Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    diteruskan: 'Diteruskan',
};

const STATUS_ICONS = {
    diterima: '📥',
    diverifikasi: '✅',
    diproses: '⚙️',
    selesai: '🎉',
    ditolak: '❌',
    diteruskan: '📤',
};

export default function StatusBadge({ status, showIcon = true, className = '' }) {
    const normalizedStatus = (status || '').toLowerCase().trim();
    const label = STATUS_LABELS[normalizedStatus] || status || 'Tidak Diketahui';
    const icon = STATUS_ICONS[normalizedStatus] || '📋';
    const badgeClass = `badge-status badge-status-${normalizedStatus} ${className}`.trim();

    return (
        <span className={badgeClass} title={`Status: ${label}`}>
            {showIcon && <span className="badge-status-icon">{icon}</span>}
            <span className="badge-status-label">{label}</span>
        </span>
    );
}
