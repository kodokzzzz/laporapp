/**
 * Toast Component
 *
 * Auto-dismissing toast notification that slides in from the top-right.
 * Supports success, error, warning, and info variants.
 * Automatically hides after the specified duration.
 *
 * @param {string} message - Toast message text
 * @param {string} type - Variant: 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {boolean} show - Whether the toast is visible
 * @param {function} onClose - Callback when the toast closes
 * @param {number} duration - Auto-dismiss time in ms (default: 5000, 0 = no auto-dismiss)
 * @param {string} className - Additional CSS classes
 */

import { useState, useEffect, useRef } from 'react';

const TYPE_CONFIG = {
    success: { icon: '✅', label: 'Berhasil' },
    error: { icon: '❌', label: 'Gagal' },
    warning: { icon: '⚠️', label: 'Peringatan' },
    info: { icon: 'ℹ️', label: 'Informasi' },
};

export default function Toast({
    message,
    type = 'info',
    show = false,
    onClose,
    duration = 5000,
    className = '',
}) {
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef(null);
    const pausedRef = useRef(false);
    const remainingRef = useRef(duration);
    const startTimeRef = useRef(null);

    const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

    /**
     * Start the auto-dismiss timer.
     */
    const startTimer = () => {
        if (duration <= 0) return;
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            closeToast();
        }, remainingRef.current);
    };

    /**
     * Pause the timer (e.g., on hover).
     */
    const pauseTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            const elapsed = Date.now() - (startTimeRef.current || Date.now());
            remainingRef.current = Math.max(0, remainingRef.current - elapsed);
            pausedRef.current = true;
        }
    };

    /**
     * Resume the timer after hover ends.
     */
    const resumeTimer = () => {
        if (pausedRef.current && remainingRef.current > 0) {
            pausedRef.current = false;
            startTimer();
        }
    };

    /**
     * Trigger close animation and callback.
     */
    const closeToast = () => {
        setAnimating(false);
        setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, 300);
    };

    /* Handle show/hide transitions */
    useEffect(() => {
        if (show) {
            remainingRef.current = duration;
            setVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimating(true);
                });
            });
            startTimer();
        } else {
            setAnimating(false);
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [show]);

    if (!visible) return null;

    return (
        <div
            className={`toast toast-${type} ${animating ? 'toast-active' : ''} ${className}`.trim()}
            role="alert"
            aria-live="assertive"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
        >
            <div className="toast-icon">{config.icon}</div>
            <div className="toast-content">
                <p className="toast-label">{config.label}</p>
                <p className="toast-message">{message}</p>
            </div>
            <button
                type="button"
                className="toast-close"
                onClick={closeToast}
                aria-label="Tutup notifikasi"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Progress bar indicating time remaining */}
            {duration > 0 && animating && (
                <div
                    className="toast-progress"
                    style={{ animationDuration: `${duration}ms` }}
                />
            )}
        </div>
    );
}
