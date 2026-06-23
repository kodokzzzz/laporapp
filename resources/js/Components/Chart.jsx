/**
 * Chart Component
 *
 * Renders simple but attractive SVG charts without external libraries.
 * Supports bar, line, pie, and donut chart types.
 * Includes hover tooltips and CSS-based entry animations.
 *
 * @param {string} type - Chart type: 'bar', 'line', 'pie', 'donut'
 * @param {Array} data - Array of data points: { label: string, value: number, color: string }
 * @param {number} height - SVG height in pixels (default: 300)
 * @param {string} title - Optional chart title
 * @param {string} className - Additional CSS classes
 */

import { useState, useMemo } from 'react';

/* ======================================================================
 * BAR CHART
 * ====================================================================== */
function BarChart({ data, width, height, padding }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barGap = 8;
    const barWidth = Math.max(
        12,
        (chartWidth - barGap * (data.length - 1)) / data.length
    );

    /* Y-axis grid lines (5 lines) */
    const gridLines = Array.from({ length: 5 }, (_, i) => {
        const value = (maxValue / 4) * i;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        return { value, y };
    });

    return (
        <svg className="chart-svg chart-bar" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {gridLines.map((line, i) => (
                <g key={`grid-${i}`}>
                    <line
                        x1={padding.left}
                        y1={line.y}
                        x2={width - padding.right}
                        y2={line.y}
                        className="chart-grid-line"
                    />
                    <text
                        x={padding.left - 8}
                        y={line.y + 4}
                        className="chart-axis-label"
                        textAnchor="end"
                    >
                        {Math.round(line.value).toLocaleString('id-ID')}
                    </text>
                </g>
            ))}

            {/* Bars */}
            {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * chartHeight;
                const x = padding.left + index * (barWidth + barGap);
                const y = padding.top + chartHeight - barHeight;
                const isHovered = hoveredIndex === index;

                return (
                    <g
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="chart-bar-group"
                    >
                        {/* Bar */}
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx={4}
                            ry={4}
                            fill={item.color || 'var(--color-primary)'}
                            className={`chart-bar-rect ${isHovered ? 'chart-bar-rect-hovered' : ''}`}
                            style={{ animationDelay: `${index * 80}ms` }}
                        />

                        {/* X-axis label */}
                        <text
                            x={x + barWidth / 2}
                            y={height - 8}
                            className="chart-axis-label chart-bar-label"
                            textAnchor="middle"
                        >
                            {item.label.length > 8 ? item.label.slice(0, 7) + '…' : item.label}
                        </text>

                        {/* Tooltip on hover */}
                        {isHovered && (
                            <g>
                                <rect
                                    x={x + barWidth / 2 - 30}
                                    y={y - 32}
                                    width={60}
                                    height={24}
                                    rx={4}
                                    className="chart-tooltip-bg"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 16}
                                    className="chart-tooltip-text"
                                    textAnchor="middle"
                                >
                                    {item.value.toLocaleString('id-ID')}
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

/* ======================================================================
 * LINE CHART
 * ====================================================================== */
function LineChart({ data, width, height, padding }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = data.map((item, index) => {
        const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
        const y = padding.top + chartHeight - (item.value / maxValue) * chartHeight;
        return { x, y, ...item };
    });

    /* Build SVG path */
    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    /* Build area path (filled below line) */
    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + chartHeight} L ${points[0]?.x || 0} ${padding.top + chartHeight} Z`;

    /* Grid lines */
    const gridLines = Array.from({ length: 5 }, (_, i) => {
        const value = (maxValue / 4) * i;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        return { value, y };
    });

    return (
        <svg className="chart-svg chart-line" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {/* Grid */}
            {gridLines.map((line, i) => (
                <g key={`grid-${i}`}>
                    <line
                        x1={padding.left}
                        y1={line.y}
                        x2={width - padding.right}
                        y2={line.y}
                        className="chart-grid-line"
                    />
                    <text
                        x={padding.left - 8}
                        y={line.y + 4}
                        className="chart-axis-label"
                        textAnchor="end"
                    >
                        {Math.round(line.value).toLocaleString('id-ID')}
                    </text>
                </g>
            ))}

            {/* Area fill */}
            {points.length > 1 && (
                <path
                    d={areaPath}
                    fill="url(#lineGradient)"
                    className="chart-line-area"
                />
            )}

            {/* Line */}
            {points.length > 1 && (
                <path
                    d={linePath}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chart-line-path"
                />
            )}

            {/* Data points and labels */}
            {points.map((point, index) => {
                const isHovered = hoveredIndex === index;
                return (
                    <g
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Invisible larger hit area */}
                        <circle cx={point.x} cy={point.y} r={12} fill="transparent" />

                        {/* Visible dot */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={isHovered ? 6 : 4}
                            fill={point.color || 'var(--color-primary)'}
                            className="chart-line-dot"
                            style={{ animationDelay: `${index * 100}ms` }}
                        />

                        {/* X-axis label */}
                        <text
                            x={point.x}
                            y={height - 8}
                            className="chart-axis-label"
                            textAnchor="middle"
                        >
                            {point.label.length > 6 ? point.label.slice(0, 5) + '…' : point.label}
                        </text>

                        {/* Tooltip */}
                        {isHovered && (
                            <g>
                                <rect
                                    x={point.x - 30}
                                    y={point.y - 32}
                                    width={60}
                                    height={24}
                                    rx={4}
                                    className="chart-tooltip-bg"
                                />
                                <text
                                    x={point.x}
                                    y={point.y - 16}
                                    className="chart-tooltip-text"
                                    textAnchor="middle"
                                >
                                    {point.value.toLocaleString('id-ID')}
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

/* ======================================================================
 * PIE / DONUT CHART
 * ====================================================================== */
function PieDonutChart({ data, width, height, isDonut }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = Math.min(cx, cy) - 40;
    const innerRadius = isDonut ? outerRadius * 0.55 : 0;

    const total = data.reduce((sum, item) => sum + item.value, 0);

    /**
     * Convert polar coordinates to SVG cartesian.
     */
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    /**
     * Build an arc SVG path.
     */
    const describeArc = (centerX, centerY, outerR, innerR, startAngle, endAngle) => {
        const outerStart = polarToCartesian(centerX, centerY, outerR, endAngle);
        const outerEnd = polarToCartesian(centerX, centerY, outerR, startAngle);
        const innerStart = polarToCartesian(centerX, centerY, innerR, endAngle);
        const innerEnd = polarToCartesian(centerX, centerY, innerR, startAngle);
        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        if (innerR === 0) {
            return [
                `M ${outerStart.x} ${outerStart.y}`,
                `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
                `L ${centerX} ${centerY}`,
                'Z',
            ].join(' ');
        }

        return [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerEnd.x} ${innerEnd.y}`,
            `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
            'Z',
        ].join(' ');
    };

    /* Build slices */
    const slices = useMemo(() => {
        let cumulativeAngle = 0;
        return data.map((item, index) => {
            const sliceAngle = total > 0 ? (item.value / total) * 360 : 0;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            cumulativeAngle = endAngle;

            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

            /* Label position */
            const labelRadius = outerRadius + 20;
            const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);

            return {
                ...item,
                startAngle,
                endAngle: endAngle - 0.5, /* Small gap between slices */
                midAngle,
                percentage,
                labelPos,
                index,
            };
        });
    }, [data, total, cx, cy, outerRadius]);

    return (
        <svg className={`chart-svg ${isDonut ? 'chart-donut' : 'chart-pie'}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {/* Slices */}
            {slices.map((slice) => {
                const isHovered = hoveredIndex === slice.index;
                const path = describeArc(
                    cx,
                    cy,
                    isHovered ? outerRadius + 6 : outerRadius,
                    isHovered && isDonut ? innerRadius - 2 : innerRadius,
                    slice.startAngle,
                    slice.endAngle
                );

                return (
                    <g
                        key={slice.index}
                        onMouseEnter={() => setHoveredIndex(slice.index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="chart-pie-slice"
                        style={{ animationDelay: `${slice.index * 100}ms` }}
                    >
                        <path
                            d={path}
                            fill={slice.color || `hsl(${slice.index * 60}, 65%, 55%)`}
                            className={`chart-pie-path ${isHovered ? 'chart-pie-path-hovered' : ''}`}
                        />

                        {/* Percentage label (only for slices big enough) */}
                        {parseFloat(slice.percentage) > 5 && (
                            <text
                                x={slice.labelPos.x}
                                y={slice.labelPos.y}
                                className="chart-pie-label"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {slice.percentage}%
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Center label for donut */}
            {isDonut && (
                <g>
                    <text
                        x={cx}
                        y={cy - 8}
                        className="chart-donut-center-value"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {total.toLocaleString('id-ID')}
                    </text>
                    <text
                        x={cx}
                        y={cy + 14}
                        className="chart-donut-center-label"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        Total
                    </text>
                </g>
            )}

            {/* Tooltip */}
            {hoveredIndex !== null && slices[hoveredIndex] && (
                <g>
                    <rect
                        x={cx - 50}
                        y={4}
                        width={100}
                        height={24}
                        rx={4}
                        className="chart-tooltip-bg"
                    />
                    <text
                        x={cx}
                        y={20}
                        className="chart-tooltip-text"
                        textAnchor="middle"
                    >
                        {slices[hoveredIndex].label}: {slices[hoveredIndex].value.toLocaleString('id-ID')}
                    </text>
                </g>
            )}
        </svg>
    );
}

/* ======================================================================
 * LEGEND
 * ====================================================================== */
function ChartLegend({ data }) {
    return (
        <div className="chart-legend">
            {data.map((item, index) => (
                <div key={index} className="chart-legend-item">
                    <span
                        className="chart-legend-dot"
                        style={{ backgroundColor: item.color || `hsl(${index * 60}, 65%, 55%)` }}
                    />
                    <span className="chart-legend-label">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

/* ======================================================================
 * MAIN CHART COMPONENT
 * ====================================================================== */
export default function Chart({
    type = 'bar',
    data = [],
    height = 300,
    title,
    showLegend = true,
    className = '',
}) {
    if (!data || data.length === 0) {
        return (
            <div className={`chart chart-empty ${className}`.trim()}>
                <p className="chart-empty-text">Tidak ada data chart.</p>
            </div>
        );
    }

    /* Responsive width via viewBox — actual width is controlled by CSS */
    const width = 500;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return <BarChart data={data} width={width} height={height} padding={padding} />;
            case 'line':
                return <LineChart data={data} width={width} height={height} padding={padding} />;
            case 'pie':
                return <PieDonutChart data={data} width={width} height={height} isDonut={false} />;
            case 'donut':
                return <PieDonutChart data={data} width={width} height={height} isDonut={true} />;
            default:
                return <BarChart data={data} width={width} height={height} padding={padding} />;
        }
    };

    return (
        <div className={`chart chart-${type} ${className}`.trim()}>
            {title && <h4 className="chart-title">{title}</h4>}
            <div className="chart-container">{renderChart()}</div>
            {showLegend && (type === 'pie' || type === 'donut') && (
                <ChartLegend data={data} />
            )}
        </div>
    );
}
