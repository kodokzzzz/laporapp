import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import Timeline from '@/Components/Timeline';
import { useState } from 'react';

export default function Show({ report, timeline = [], comments = [] }) {
    const { auth } = usePage().props;
    const [showConfirm, setShowConfirm] = useState(null);

    const commentForm = useForm({ body: '' });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        commentForm.post(route('reporter.reports.comments.store', report.id), {
            preserveScroll: true,
            onSuccess: () => commentForm.reset('body'),
        });
    };

    const handleMarkComplete = () => {
        setShowConfirm(null);
        useForm({}).post(route('reporter.reports.mark-complete', report.id), {
            preserveScroll: true,
        });
    };

    const handleEscalate = () => {
        setShowConfirm(null);
        useForm({}).post(route('reporter.reports.escalate', report.id), {
            preserveScroll: true,
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout header="Detail Laporan">
            <Head title={`Laporan ${report.ticket_number}`} />

            <div className="page-container">
                {/* Back link */}
                <div className="page-back">
                    <Link href={route('reporter.reports.index')} className="back-link">
                        ← Kembali ke Daftar Laporan
                    </Link>
                </div>

                {/* Report Header */}
                <div className="detail-header">
                    <div className="detail-header-top">
                        <span className="detail-ticket">{report.ticket_number}</span>
                        <div className="detail-badges">
                            <StatusBadge status={report.status} />
                            {report.priority && <PriorityBadge priority={report.priority} />}
                        </div>
                    </div>
                    <h1 className="detail-title">{report.title}</h1>
                </div>

                <div className="detail-layout">
                    {/* Main content */}
                    <div className="detail-main">
                        {/* Description */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">📄 Deskripsi</h3>
                            </div>
                            <div className="card-body">
                                <p className="detail-description">{report.description}</p>
                            </div>
                        </div>

                        {/* Meta info */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">📋 Informasi Laporan</h3>
                            </div>
                            <div className="card-body">
                                <div className="detail-meta-grid">
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Kategori</span>
                                        <span className="detail-meta-value">{report.category?.name || '-'}</span>
                                    </div>
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Unit Tujuan</span>
                                        <span className="detail-meta-value">{report.unit?.name || '-'}</span>
                                    </div>
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Tanggal Laporan</span>
                                        <span className="detail-meta-value">{formatDate(report.created_at)}</span>
                                    </div>
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Lokasi Kejadian</span>
                                        <span className="detail-meta-value">{report.location || '-'}</span>
                                    </div>
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Tanggal Kejadian</span>
                                        <span className="detail-meta-value">{formatDate(report.incident_date)}</span>
                                    </div>
                                    <div className="detail-meta-item">
                                        <span className="detail-meta-label">Anonim</span>
                                        <span className="detail-meta-value">{report.is_anonymous ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {report.attachments && report.attachments.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">📎 Lampiran</h3>
                                </div>
                                <div className="card-body">
                                    <div className="attachment-list">
                                        {report.attachments.map((att, idx) => (
                                            <a
                                                key={idx}
                                                href={att.url || `/storage/${att.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="attachment-item"
                                            >
                                                <span className="attachment-icon">📄</span>
                                                <span className="attachment-name">{att.original_name || att.name || `Lampiran ${idx + 1}`}</span>
                                                <span className="attachment-download">⬇️</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">💬 Komentar ({comments.length})</h3>
                            </div>
                            <div className="card-body">
                                {comments.length > 0 ? (
                                    <div className="comments-list">
                                        {comments.map((comment) => (
                                            <div key={comment.id} className="comment-item">
                                                <div className="comment-header">
                                                    <div className="comment-avatar">
                                                        {(comment.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="comment-meta">
                                                        <span className="comment-author">{comment.user?.name || 'Anonim'}</span>
                                                        <span className="comment-date">
                                                            {comment.created_at
                                                                ? new Date(comment.created_at).toLocaleDateString('id-ID', {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                      hour: '2-digit',
                                                                      minute: '2-digit',
                                                                  })
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    {comment.is_internal && (
                                                        <span className="comment-internal-badge">Internal</span>
                                                    )}
                                                </div>
                                                <div className="comment-body">{comment.body}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">Belum ada komentar.</p>
                                )}

                                {/* Add comment */}
                                <form onSubmit={handleCommentSubmit} className="comment-form">
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Tulis komentar Anda..."
                                        value={commentForm.data.body}
                                        onChange={(e) => commentForm.setData('body', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                    {commentForm.errors.body && <p className="form-error">{commentForm.errors.body}</p>}
                                    <div className="comment-form-actions">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={commentForm.processing || !commentForm.data.body.trim()}
                                        >
                                            {commentForm.processing ? 'Mengirim...' : '💬 Kirim Komentar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="detail-sidebar">
                        {/* Actions */}
                        {(report.status === 'diproses' || report.status === 'diverifikasi') && (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">⚡ Aksi</h3>
                                </div>
                                <div className="card-body">
                                    <div className="action-buttons-stack">
                                        {report.status === 'diproses' && (
                                            <button
                                                className="btn btn-secondary btn-full"
                                                onClick={() => setShowConfirm('complete')}
                                            >
                                                ✅ Tandai Selesai
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-accent btn-full"
                                            onClick={() => setShowConfirm('escalate')}
                                        >
                                            ⬆️ Eskalasi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">📅 Riwayat Status</h3>
                            </div>
                            <div className="card-body">
                                <Timeline items={timeline} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Dialogs */}
                {showConfirm && (
                    <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    {showConfirm === 'complete' ? 'Tandai Selesai' : 'Eskalasi Laporan'}
                                </h3>
                                <button className="modal-close" onClick={() => setShowConfirm(null)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {showConfirm === 'complete'
                                        ? 'Apakah Anda yakin laporan ini telah selesai ditangani? Tindakan ini tidak dapat dibatalkan.'
                                        : 'Apakah Anda yakin ingin mengeskalasi laporan ini ke tingkat yang lebih tinggi?'}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowConfirm(null)}>
                                    Batal
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={showConfirm === 'complete' ? handleMarkComplete : handleEscalate}
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
