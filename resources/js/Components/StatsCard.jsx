/**
 * StatsCard Component
 *
 * Displays a statistic value in a glassmorphism card with an icon,
 * big numeric value, descriptive label, and optional trend indicator.
 *
 * @param {string} icon - Emoji or string icon to display
 * @param {number|string} value - The main statistic value
 * @param {string} label - Descriptive label below the value
 * @param {number} trend - Optional trend percentage (positive = up, negative = down)
 * @param {string} trendLabel - Optional label for the trend (e.g., "dari bulan lalu")
 * @param {string} color - Color variant: 'primary', 'secondary', 'accent', 'danger'
 * @param {string} className - Additional CSS classes
 */

export default function StatsCard({
    icon,
    value,
    label,
    trend,
    trendLabel = 'dari bulan lalu',
    color = 'primary',
    className = '',
}) {
    const isPositiveTrend = trend > 0;
    const isNegativeTrend = trend < 0;
    const hasTrend = trend !== undefined && trend !== null;

    const trendDirection = isPositiveTrend ? 'up' : isNegativeTrend ? 'down' : 'neutral';
    const trendArrow = isPositiveTrend ? '↑' : isNegativeTrend ? '↓' : '→';

    const cardClass = `stats-card stats-card-${color} ${className}`.trim();

    /**
     * Format large numbers with Indonesian locale separators
     * e.g., 1234567 → "1.234.567"
     */
    const formatValue = (val) => {
        if (typeof val === 'number') {
            return val.toLocaleString('id-ID');
        }
        return val;
    };

    return (
        <div className={cardClass}>
            <div className="stats-card-header">
                <div className="stats-card-icon">{icon}</div>
                {hasTrend && (
                    <div className={`stats-card-trend stats-card-trend-${trendDirection}`}>
                        <span className="stats-card-trend-arrow">{trendArrow}</span>
                        <span className="stats-card-trend-value">
                            {Math.abs(trend)}%
                        </span>
                    </div>
                )}
            </div>

            <div className="stats-card-body">
                <div className="stats-card-value">{formatValue(value)}</div>
                <div className="stats-card-label">{label}</div>
            </div>

            {hasTrend && trendLabel && (
                <div className="stats-card-footer">
                    <span className={`stats-card-trend-label stats-card-trend-${trendDirection}`}>
                        {trendArrow} {Math.abs(trend)}% {trendLabel}
                    </span>
                </div>
            )}
        </div>
    );
}
