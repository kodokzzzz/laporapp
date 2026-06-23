import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useRef } from 'react';

export default function Create({ categories = [], units = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category_id: '',
        unit_id: '',
        description: '',
        location: '',
        incident_date: '',
        is_anonymous: false,
        attachments: [],
    });

    const [showPreview, setShowPreview] = useState(false);
    const [fileNames, setFileNames] = useState([]);
    const fileInputRef = useRef(null);
    const maxDescLength = 2000;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + fileNames.length > 5) {
            alert('Maksimal 5 file lampiran.');
            return;
        }
        const existingFiles = Array.from(data.attachments || []);
        const newFiles = [...existingFiles, ...files].slice(0, 5);
        setData('attachments', newFiles);
        setFileNames(newFiles.map(f => f.name));
    };

    const removeFile = (idx) => {
        const newFiles = Array.from(data.attachments || []).filter((_, i) => i !== idx);
        setData('attachments', newFiles);
        setFileNames(newFiles.map(f => f.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reporter.reports.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFileNames([]);
            },
        });
    };

    const selectedCategory = categories.find(c => c.id == data.category_id);
    const selectedUnit = units.find(u => u.id == data.unit_id);

    return (
        <AuthenticatedLayout header="Buat Laporan">
            <Head title="Buat Laporan" />

            <div className="page-container">
                <div className="form-page-layout">
                    <div className="form-card">
                        <div className="form-card-header">
                            <h2 className="form-card-title">📝 Formulir Laporan Baru</h2>
                            <p className="form-card-subtitle">Isi formulir dengan lengkap dan jelas untuk mempercepat proses penanganan.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="form-body">
                            {/* Judul */}
                            <div className="form-group">
                                <label htmlFor="title" className="form-label">
                                    Judul Laporan <span className="form-required">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul laporan Anda"
                                    maxLength={150}
                                    required
                                />
                                <div className="form-help">
                                    <span>{data.title.length}/150 karakter</span>
                                </div>
                                {errors.title && <p className="form-error">{errors.title}</p>}
                            </div>

                            {/* Category & Unit */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category_id" className="form-label">
                                        Kategori <span className="form-required">*</span>
                                    </label>
                                    <select
                                        id="category_id"
                                        className={`form-select ${errors.category_id ? 'form-input-error' : ''}`}
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="form-error">{errors.category_id}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="unit_id" className="form-label">
                                        Unit Tujuan <span className="form-optional">(opsional)</span>
                                    </label>
                                    <select
                                        id="unit_id"
                                        className="form-select"
                                        value={data.unit_id}
                                        onChange={(e) => setData('unit_id', e.target.value)}
                                    >
                                        <option value="">Pilih Unit (opsional)</option>
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                                        ))}
                                    </select>
                                    {errors.unit_id && <p className="form-error">{errors.unit_id}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Deskripsi <span className="form-required">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
                                    value={data.description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= maxDescLength) {
                                            setData('description', e.target.value);
                                        }
                                    }}
                                    placeholder="Jelaskan laporan Anda secara detail..."
                                    rows={6}
                                    required
                                />
                                <div className="form-help">
                                    <span className={data.description.length > maxDescLength - 100 ? 'text-warning' : ''}>
                                        {data.description.length}/{maxDescLength} karakter
                                    </span>
                                </div>
                                {errors.description && <p className="form-error">{errors.description}</p>}
                            </div>

                            {/* Location & Date */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="location" className="form-label">
                                        Lokasi Kejadian <span className="form-optional">(opsional)</span>
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        className="form-input"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Alamat atau nama lokasi"
                                    />
                                    {errors.location && <p className="form-error">{errors.location}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="incident_date" className="form-label">
                                        Tanggal Kejadian <span className="form-optional">(opsional)</span>
                                    </label>
                                    <input
                                        id="incident_date"
                                        type="date"
                                        className="form-input"
                                        value={data.incident_date}
                                        onChange={(e) => setData('incident_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.incident_date && <p className="form-error">{errors.incident_date}</p>}
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="form-group">
                                <label className="form-label">
                                    Lampiran <span className="form-optional">(maks. 5 file)</span>
                                </label>
                                <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        className="file-input-hidden"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                    />
                                    <div className="file-upload-content">
                                        <span className="file-upload-icon">📎</span>
                                        <p className="file-upload-text">Klik untuk memilih file atau drag & drop</p>
                                        <p className="file-upload-hint">Format: gambar, PDF, DOC, XLS (maks. 5 file)</p>
                                    </div>
                                </div>
                                {fileNames.length > 0 && (
                                    <div className="file-list">
                                        {fileNames.map((name, idx) => (
                                            <div key={idx} className="file-list-item">
                                                <span className="file-list-name">📄 {name}</span>
                                                <button
                                                    type="button"
                                                    className="file-list-remove"
                                                    onClick={() => removeFile(idx)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.attachments && <p className="form-error">{errors.attachments}</p>}
                            </div>

                            {/* Anonymous toggle */}
                            <div className="form-group">
                                <label className="toggle-label">
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={data.is_anonymous}
                                            onChange={(e) => setData('is_anonymous', e.target.checked)}
                                        />
                                        <span className="toggle-slider" />
                                    </div>
                                    <div className="toggle-info">
                                        <span className="toggle-title">Laporan Anonim</span>
                                        <span className="toggle-desc">Identitas Anda tidak akan ditampilkan kepada publik</span>
                                    </div>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPreview(true)}
                                    disabled={!data.title || !data.description || !data.category_id}
                                >
                                    👁️ Preview
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <><span className="btn-spinner" /> Mengirim...</>
                                    ) : (
                                        <>📤 Kirim Laporan</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Modal */}
                    {showPreview && (
                        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3 className="modal-title">Preview Laporan</h3>
                                    <button className="modal-close" onClick={() => setShowPreview(false)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <div className="preview-grid">
                                        <div className="preview-item">
                                            <span className="preview-label">Judul</span>
                                            <span className="preview-value">{data.title}</span>
                                        </div>
                                        <div className="preview-item">
                                            <span className="preview-label">Kategori</span>
                                            <span className="preview-value">{selectedCategory?.name || '-'}</span>
                                        </div>
                                        <div className="preview-item">
                                            <span className="preview-label">Unit Tujuan</span>
                                            <span className="preview-value">{selectedUnit?.name || 'Belum dipilih'}</span>
                                        </div>
                                        <div className="preview-item preview-item-full">
                                            <span className="preview-label">Deskripsi</span>
                                            <p className="preview-value preview-desc">{data.description}</p>
                                        </div>
                                        {data.location && (
                                            <div className="preview-item">
                                                <span className="preview-label">Lokasi</span>
                                                <span className="preview-value">{data.location}</span>
                                            </div>
                                        )}
                                        {data.incident_date && (
                                            <div className="preview-item">
                                                <span className="preview-label">Tanggal Kejadian</span>
                                                <span className="preview-value">{data.incident_date}</span>
                                            </div>
                                        )}
                                        <div className="preview-item">
                                            <span className="preview-label">Anonim</span>
                                            <span className="preview-value">{data.is_anonymous ? 'Ya' : 'Tidak'}</span>
                                        </div>
                                        {fileNames.length > 0 && (
                                            <div className="preview-item preview-item-full">
                                                <span className="preview-label">Lampiran ({fileNames.length} file)</span>
                                                <div className="preview-files">
                                                    {fileNames.map((name, idx) => (
                                                        <span key={idx} className="preview-file">📄 {name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>
                                        Kembali Edit
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={(e) => { setShowPreview(false); handleSubmit(e); }}
                                        disabled={processing}
                                    >
                                        📤 Kirim Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
