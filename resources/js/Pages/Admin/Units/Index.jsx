import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ units }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    // Form setup for add/edit
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        sla_days: 14,
        is_active: true,
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (unit) => {
        reset();
        clearErrors();
        setSelectedUnit(unit);
        setData({
            name: unit.name,
            description: unit.description || '',
            sla_days: unit.sla_days || 14,
            is_active: unit.is_active,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (unit) => {
        setSelectedUnit(unit);
        setIsDeleteModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route('admin.units.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('admin.units.update', selectedUnit.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        destroy(route('admin.units.destroy', selectedUnit.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
            },
        });
    };

    const columns = [
        { key: 'name', label: 'Nama Unit Kerja', render: (_, row) => <span className="font-bold">{row.name}</span> },
        { key: 'description', label: 'Deskripsi', render: (_, row) => <span className="line-clamp-2 text-secondary">{row.description || '-'}</span> },
        { key: 'sla_days', label: 'SLA (Hari)', render: (_, row) => <span className="badge" style={{ background: 'var(--primary-100)', color: 'var(--primary-800)' }}>{row.sla_days} Hari</span> },
        { key: 'reports_count', label: 'Total Laporan', render: (_, row) => <span className="font-bold">{row.reports_count || 0}</span> },
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
        <AuthenticatedLayout header="Kelola Unit Kerja">
            <Head title="Manajemen Unit Kerja — Admin LAPOR!" />
            <div className="page-container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="page-header-title">Manajemen Unit Kerja (Dinas/Instansi)</h2>
                        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Kelola daftar unit pelaksana teknis yang akan menindaklanjuti laporan.</p>
                    </div>
                    <div>
                        <button onClick={openAddModal} className="btn btn-primary">
                            + Tambah Unit
                        </button>
                    </div>
                </div>

                <div className="card shadow-md">
                    <div className="card-body p-0">
                        <DataTable columns={columns} data={units.data || units} pagination={units} searchable={true} searchPlaceholder="Cari unit kerja..." />
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Unit Kerja Baru" maxWidth="md">
                <form onSubmit={handleAddSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Unit Kerja Baru</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Unit Kerja</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Dinas Pekerjaan Umum"
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Deskripsi / Wewenang</label>
                        <textarea
                            className={`form-input ${errors.description ? 'border-danger' : ''}`}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Penjelasan wewenang dan tugas unit ini..."
                            rows="3"
                        ></textarea>
                        {errors.description && <div className="text-danger mt-1 text-sm">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Standar Waktu Penyelesaian (SLA) - Hari</label>
                        <input
                            type="number"
                            min="1"
                            className={`form-input ${errors.sla_days ? 'border-danger' : ''}`}
                            value={data.sla_days}
                            onChange={(e) => setData('sla_days', parseInt(e.target.value))}
                        />
                        {errors.sla_days && <div className="text-danger mt-1 text-sm">{errors.sla_days}</div>}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Batas waktu unit merespon laporan (default: 14 hari).</p>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span>Aktifkan unit ini agar bisa dipilih di form pengaduan</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="btn btn-primary">
                            {processing ? 'Menyimpan...' : 'Simpan Unit Kerja'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Unit Kerja" maxWidth="md">
                <form onSubmit={handleEditSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Edit Unit Kerja</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Unit Kerja</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Deskripsi / Wewenang</label>
                        <textarea
                            className={`form-input ${errors.description ? 'border-danger' : ''}`}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="3"
                        ></textarea>
                        {errors.description && <div className="text-danger mt-1 text-sm">{errors.description}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Standar Waktu Penyelesaian (SLA) - Hari</label>
                        <input
                            type="number"
                            min="1"
                            className={`form-input ${errors.sla_days ? 'border-danger' : ''}`}
                            value={data.sla_days}
                            onChange={(e) => setData('sla_days', parseInt(e.target.value))}
                        />
                        {errors.sla_days && <div className="text-danger mt-1 text-sm">{errors.sla_days}</div>}
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span>Unit Kerja Aktif</span>
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
                    <h2 className="text-lg font-bold mb-2">Hapus Unit Kerja?</h2>
                    <p className="text-secondary mb-6">
                        Apakah Anda yakin ingin menghapus unit <strong>{selectedUnit?.name}</strong>? Tindakan ini tidak dapat dibatalkan. Jika unit ini memiliki operator atau laporan tertaut, pastikan untuk memindahkannya terlebih dahulu.
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
