import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ categories }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Form setup for add/edit
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        is_active: true,
        sort_order: 0,
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (category) => {
        reset();
        clearErrors();
        setSelectedCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
            is_active: category.is_active,
            sort_order: category.sort_order || 0,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', selectedCategory.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        destroy(route('admin.categories.destroy', selectedCategory.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const columns = [
        { key: 'name', label: 'Nama Kategori', render: (_, row) => <span className="font-bold">{row.name}</span> },
        { key: 'description', label: 'Deskripsi', render: (_, row) => <span className="line-clamp-2 text-secondary">{row.description || '-'}</span> },
        { key: 'reports_count', label: 'Total Laporan', render: (_, row) => <span className="badge">{row.reports_count || 0}</span> },
        { key: 'is_active', label: 'Status', render: (_, row) => row.is_active ? <span className="text-success font-bold">Aktif</span> : <span className="text-danger font-bold">Nonaktif</span> },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(row)} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        ✏️ Edit
                    </button>
                    <button onClick={() => openDeleteModal(row)} className="btn btn-outline btn-sm text-danger" style={{ borderColor: 'var(--danger)', padding: '0.25rem 0.5rem' }}>
                        🗑️ Hapus
                    </button>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header="Kelola Kategori">
            <Head title="Manajemen Kategori — Admin LAPOR!" />
            <div className="page-container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="page-header-title">Manajemen Kategori Laporan</h2>
                        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Kelola daftar kategori untuk klasifikasi laporan masuk.</p>
                    </div>
                    <div>
                        <button onClick={openAddModal} className="btn btn-primary">
                            + Tambah Kategori
                        </button>
                    </div>
                </div>

                <div className="card shadow-md">
                    <div className="card-body p-0">
                        <DataTable columns={columns} data={categories.data || categories} pagination={categories} searchable={true} searchPlaceholder="Cari kategori..." />
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Kategori Baru" maxWidth="md">
                <form onSubmit={handleAddSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Kategori Baru</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Kategori</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Infrastruktur"
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Deskripsi</label>
                        <textarea
                            className={`form-input ${errors.description ? 'border-danger' : ''}`}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Penjelasan singkat mengenai kategori ini..."
                            rows="3"
                        ></textarea>
                        {errors.description && <div className="text-danger mt-1 text-sm">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span>Aktifkan kategori ini segera</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="btn btn-primary">
                            {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Kategori" maxWidth="md">
                <form onSubmit={handleEditSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Edit Kategori</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Kategori</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Deskripsi</label>
                        <textarea
                            className={`form-input ${errors.description ? 'border-danger' : ''}`}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="3"
                        ></textarea>
                        {errors.description && <div className="text-danger mt-1 text-sm">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span>Kategori Aktif</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="btn btn-primary">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 className="text-lg font-bold mb-2">Hapus Kategori?</h2>
                    <p className="text-secondary mb-6">
                        Apakah Anda yakin ingin menghapus kategori <strong>{selectedCategory?.name}</strong>? Tindakan ini tidak dapat dibatalkan. Kategori yang sudah memiliki laporan mungkin tidak bisa dihapus.
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="button" onClick={handleDelete} disabled={processing} className="btn btn-danger" style={{ background: 'var(--danger)', color: 'white' }}>
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
