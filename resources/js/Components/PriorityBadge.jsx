/**
 * PriorityBadge Component
 *
 * Displays a report's priority level as a colored badge.
 * Each priority maps to an Indonesian label and CSS class
 * .badge-priority-{priority} defined in app.css.
 *
 * @param {string} priority - One of: rendah, sedang, tinggi, mendesak
 * @param {boolean} showIcon - Whether to display the priority icon (default: true)
 * @param {string} className - Additional CSS classes
 */

const PRIORITY_LABELS = {
    rendah: 'Rendah',
    sedang: 'Sedang',
    tinggi: 'Tinggi',
    mendesak: 'Mendesak',
};

const PRIORITY_ICONS = {
    rendah: '🟢',
    sedang: '🟡',
    tinggi: '🟠',
    mendesak: '🔴',
};

export default function PriorityBadge({ priority, showIcon = true, className = '' }) {
    const normalizedPriority = (priority || '').toLowerCase().trim();
    const label = PRIORITY_LABELS[normalizedPriority] || priority || 'Tidak Diketahui';
    const icon = PRIORITY_ICONS[normalizedPriority] || '⚪';
    const badgeClass = `badge-priority badge-priority-${normalizedPriority} ${className}`.trim();

    return (
        <span className={badgeClass} title={`Prioritas: ${label}`}>
            {showIcon && <span className="badge-priority-icon">{icon}</span>}
            <span className="badge-priority-label">{label}</span>
        </span>
    );
}
