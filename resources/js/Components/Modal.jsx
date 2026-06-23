/**
 * Modal Component
 *
 * A reusable modal dialog with smooth open/close transitions.
 * Uses a portal-like overlay pattern. Closes on overlay click or Escape key.
 * Prevents body scroll when open.
 *
 * @param {boolean} show - Whether the modal is visible
 * @param {function} onClose - Callback when the modal should close
 * @param {string} title - Modal header title
 * @param {string} maxWidth - Width preset: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {React.ReactNode} children - Modal body content
 * @param {React.ReactNode} footer - Optional footer content
 * @param {boolean} closeable - Whether clicking overlay / pressing Esc closes modal (default: true)
 * @param {string} className - Additional CSS classes
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export default function Modal({
    show = false,
    onClose,
    title,
    maxWidth = 'md',
    children,
    footer,
    closeable = true,
    className = '',
}) {
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);
    const modalRef = useRef(null);

    /* Handle open/close transitions */
    useEffect(() => {
        if (show) {
            /* Opening: mount first, then animate in */
            setVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimating(true);
                });
            });
            /* Prevent body scrolling */
            document.body.style.overflow = 'hidden';
        } else {
            /* Closing: animate out, then unmount */
            setAnimating(false);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 300); /* Match CSS transition duration */
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    /* Close on Escape key */
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape' && closeable) {
                onClose?.();
            }
        },
        [closeable, onClose]
    );

    useEffect(() => {
        if (show) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [show, handleKeyDown]);

    /* Focus trap: focus the modal on open */
    useEffect(() => {
        if (show && modalRef.current) {
            modalRef.current.focus();
        }
    }, [show]);

    /* Click on overlay to close */
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeable) {
            onClose?.();
        }
    };

    if (!visible) return null;

    return (
        <div
            className={`modal-overlay ${animating ? 'modal-overlay-active' : ''}`}
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={modalRef}
                className={`modal modal-${maxWidth} ${animating ? 'modal-active' : ''} ${className}`.trim()}
                tabIndex={-1}
            >
                {/* Header */}
                {(title || closeable) && (
                    <div className="modal-header">
                        {title && <h3 className="modal-title">{title}</h3>}
                        {closeable && (
                            <button
                                type="button"
                                className="modal-close"
                                onClick={onClose}
                                aria-label="Tutup modal"
                            >
                                <svg
                                    width="20"
                                    height="20"
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
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="modal-body">{children}</div>

                {/* Footer (optional) */}
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}
