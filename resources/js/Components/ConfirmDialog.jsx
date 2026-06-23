/**
 * ConfirmDialog Component
 *
 * A confirmation dialog built on top of the Modal component.
 * Displays a warning/danger/info icon, title, message, and
 * confirm/cancel action buttons.
 *
 * @param {boolean} show - Whether the dialog is visible
 * @param {function} onConfirm - Callback when confirm button is clicked
 * @param {function} onCancel - Callback when cancel button is clicked
 * @param {string} title - Dialog title (default: "Konfirmasi")
 * @param {string} message - Dialog message/body text
 * @param {string} confirmText - Confirm button label (default: "Ya, Lanjutkan")
 * @param {string} cancelText - Cancel button label (default: "Batal")
 * @param {string} variant - Visual variant: 'danger', 'warning', 'info' (default: 'warning')
 * @param {boolean} loading - If true, shows loading state on confirm button
 */

import { useState } from 'react';
import Modal from './Modal';

const VARIANT_CONFIG = {
    danger: {
        icon: '🚨',
        confirmClass: 'confirm-dialog-btn-danger',
    },
    warning: {
        icon: '⚠️',
        confirmClass: 'confirm-dialog-btn-warning',
    },
    info: {
        icon: 'ℹ️',
        confirmClass: 'confirm-dialog-btn-info',
    },
};

export default function ConfirmDialog({
    show = false,
    onConfirm,
    onCancel,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'warning',
    loading = false,
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.warning;

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm?.();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        if (!isProcessing) {
            onCancel?.();
        }
    };

    const isLoading = loading || isProcessing;

    return (
        <Modal
            show={show}
            onClose={handleCancel}
            maxWidth="sm"
            closeable={!isLoading}
        >
            <div className={`confirm-dialog confirm-dialog-${variant}`}>
                {/* Icon */}
                <div className="confirm-dialog-icon">{config.icon}</div>

                {/* Title */}
                <h3 className="confirm-dialog-title">{title}</h3>

                {/* Message */}
                <p className="confirm-dialog-message">{message}</p>

                {/* Action buttons */}
                <div className="confirm-dialog-actions">
                    <button
                        type="button"
                        className="confirm-dialog-btn confirm-dialog-btn-cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`confirm-dialog-btn ${config.confirmClass}`}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <span className="confirm-dialog-btn-spinner" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
