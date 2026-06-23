/**
 * LoadingSpinner Component
 *
 * Renders an animated CSS loading spinner. Size and color can be
 * configured via props. The animation is defined in app.css.
 *
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} color - CSS color for the spinner (default uses primary color)
 * @param {string} label - Optional screen-reader accessible label
 * @param {boolean} overlay - If true, renders with full-area overlay backdrop
 * @param {string} className - Additional CSS classes
 */

export default function LoadingSpinner({
    size = 'md',
    color,
    label = 'Memuat...',
    overlay = false,
    className = '',
}) {
    const spinnerStyle = color ? { borderTopColor: color, borderRightColor: color } : {};

    const spinner = (
        <div className={`loading-spinner-wrapper loading-spinner-${size} ${className}`.trim()}>
            <div className="loading-spinner" style={spinnerStyle} role="status">
                <span className="loading-spinner-sr-only">{label}</span>
            </div>
            {label && <p className="loading-spinner-label">{label}</p>}
        </div>
    );

    if (overlay) {
        return (
            <div className="loading-spinner-overlay">
                {spinner}
            </div>
        );
    }

    return spinner;
}
