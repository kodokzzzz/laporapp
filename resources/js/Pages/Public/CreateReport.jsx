import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

export default function CreateReport({ categories, types }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth && auth.user;

    const { data, setData, post, processing, errors } = useForm({
        type: 'pengaduan',
        title: '',
        description: '',
        category_id: '',
        location: '',
        incident_date: '',
        is_anonymous: false,
        is_secret: false,
        guest_name: '',
        guest_email: '',
        guest_phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('public.reports.store'));
    };

    return (
        <GuestLayout>
            <Head title="Buat Laporan — LAPOR!" />

            <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div className="card shadow-xl" style={{ borderTop: '4px solid var(--primary)' }}>
                    <div className="card-header" style={{ paddingBottom: '0.5rem', textAlign: 'center' }}>
                        <h2 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sampaikan Laporan Anda</h2>
                        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                            Perhatikan cara menyampaikan pengaduan yang baik dan benar.
                        </p>
                    </div>

                    <div className="card-body">
                        <form onSubmit={submit} className="form-layout" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            
                            {/* JENIS LAPORAN */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="type">Klasifikasi Laporan <span className="text-danger">*</span></label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {Object.entries(types).map(([key, label]) => (
                                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', border: `1px solid ${data.type === key ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', background: data.type === key ? 'var(--primary-50)' : 'transparent' }}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value={key}
                                                checked={data.type === key}
                                                onChange={(e) => setData('type', e.target.value)}
                                                style={{ width: '1rem', height: '1rem' }}
                                            />
                                            <span style={{ fontWeight: data.type === key ? '600' : '400', color: data.type === key ? 'var(--primary-700)' : 'var(--text-primary)' }}>{label}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.type && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.type}</span>}
                            </div>

                            {/* JUDUL */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Judul Laporan <span className="text-danger">*</span></label>
                                <input
                                    id="title"
                                    type="text"
                                    className={`form-input ${errors.title ? 'border-danger' : ''}`}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ketik judul laporan Anda"
                                    required
                                />
                                {errors.title && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.title}</span>}
                            </div>

                            {/* KETERANGAN */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Isi Laporan <span className="text-danger">*</span></label>
                                <textarea
                                    id="description"
                                    className={`form-textarea ${errors.description ? 'border-danger' : ''}`}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Ketik isi laporan Anda secara detail dan jelas"
                                    rows={5}
                                    required
                                />
                                {errors.description && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</span>}
                            </div>

                            {/* KATEGORI */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="category_id">Kategori Laporan <span className="text-danger">*</span></label>
                                <select
                                    id="category_id"
                                    className={`form-select ${errors.category_id ? 'border-danger' : ''}`}
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category_id}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {/* LOKASI */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="location">Lokasi Kejadian (Opsional)</label>
                                    <input
                                        id="location"
                                        type="text"
                                        className={`form-input ${errors.location ? 'border-danger' : ''}`}
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Misal: Jl. Sudirman, Jakarta"
                                    />
                                    {errors.location && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.location}</span>}
                                </div>

                                {/* TANGGAL KEJADIAN */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="incident_date">Tanggal Kejadian (Opsional)</label>
                                    <input
                                        id="incident_date"
                                        type="date"
                                        className={`form-input ${errors.incident_date ? 'border-danger' : ''}`}
                                        value={data.incident_date}
                                        onChange={(e) => setData('incident_date', e.target.value)}
                                    />
                                    {errors.incident_date && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.incident_date}</span>}
                                </div>
                            </div>

                            {/* GUEST INFO (Hanya tampil jika belum login) */}
                            {!isLoggedIn && (
                                <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Data Pelapor (Opsional)</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        Isi data di bawah ini agar petugas kami dapat menghubungi Anda jika diperlukan informasi tambahan. Anda bisa membiarkannya kosong. Atau, silakan <Link href={route('login')} className="text-primary font-bold">Login</Link> terlebih dahulu.
                                    </p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                        <div className="form-group mb-0">
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={data.guest_name}
                                                onChange={(e) => setData('guest_name', e.target.value)}
                                                placeholder="Nama Anda"
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group mb-0">
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    value={data.guest_email}
                                                    onChange={(e) => setData('guest_email', e.target.value)}
                                                    placeholder="Alamat Email"
                                                />
                                            </div>
                                            <div className="form-group mb-0">
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={data.guest_phone}
                                                    onChange={(e) => setData('guest_phone', e.target.value)}
                                                    placeholder="Nomor HP/WA"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FLAGS */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary-200)' }}>
                                <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.is_anonymous}
                                        onChange={(e) => setData('is_anonymous', e.target.checked)}
                                        style={{ marginTop: '0.2rem' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Lapor Anonim</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nama Anda tidak akan dipublikasikan pada laporan ini.</div>
                                    </div>
                                </label>

                                <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.is_secret}
                                        onChange={(e) => setData('is_secret', e.target.checked)}
                                        style={{ marginTop: '0.2rem' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Laporan Rahasia</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Laporan Anda tidak akan bisa dilihat oleh publik. Hanya Anda dan petugas yang bisa melihatnya.</div>
                                    </div>
                                </label>
                            </div>

                            {/* SUBMIT */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={processing}
                                    style={{ width: '100%', maxWidth: '300px' }}
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Laporan'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
