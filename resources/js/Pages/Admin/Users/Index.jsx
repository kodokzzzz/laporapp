import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ users, filters, roles, units }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form setup for add/edit
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'pelapor',
        unit_id: '',
        is_active: true,
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setIsAddModalOpen(true);
    };

    const openEditModal = (user) => {
        reset();
        clearErrors();
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            unit_id: user.unit_id || '',
            is_active: user.is_active,
        });
        setIsEditModalOpen(true);
    };

    const openResetModal = (user) => {
        setSelectedUser(user);
        setIsResetModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', selectedUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    const handleToggleActive = (user) => {
        router.post(route('admin.users.toggle-active', user.id), {}, { preserveScroll: true });
    };

    const handleResetPassword = () => {
        router.post(route('admin.users.reset-password', selectedUser.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsResetModalOpen(false);
                alert(`Password untuk ${selectedUser.name} berhasil direset menjadi: password123`);
            }
        });
    };

    const columns = [
        { 
            key: 'name', 
            label: 'Pengguna', 
            render: (_, row) => (
                <div>
                    <div className="font-bold text-primary">{row.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.email}</div>
                    {row.phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📱 {row.phone}</div>}
                </div>
            ) 
        },
        { 
            key: 'role', 
            label: 'Peran', 
            render: (_, row) => (
                <span className={`badge ${row.role === 'admin' ? 'bg-danger text-white' : row.role === 'operator' ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ textTransform: 'capitalize' }}>
                    {row.role}
                </span>
            ) 
        },
        { key: 'unit', label: 'Unit Kerja', render: (_, row) => row.unit?.name ? <span className="font-medium text-secondary">🏢 {row.unit.name}</span> : '-' },
        { key: 'is_active', label: 'Status', render: (_, row) => row.is_active ? <span className="text-success font-bold">Aktif</span> : <span className="text-danger font-bold">Nonaktif</span> },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => openEditModal(row)} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        ✏️ Edit
                    </button>
                    {row.role !== 'pelapor' && (
                        <>
                            <button onClick={() => handleToggleActive(row)} className={`btn btn-outline btn-sm ${row.is_active ? 'text-danger' : 'text-success'}`} style={{ borderColor: row.is_active ? 'var(--danger)' : 'var(--success)', padding: '0.25rem 0.5rem' }}>
                                {row.is_active ? '❌ Nonaktifkan' : '✅ Aktifkan'}
                            </button>
                            <button onClick={() => openResetModal(row)} className="btn btn-outline btn-sm text-warning" style={{ borderColor: 'var(--warning)', padding: '0.25rem 0.5rem' }}>
                                🔑 Reset
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout header="Kelola Pengguna">
            <Head title="Manajemen Pengguna — Admin LAPOR!" />
            <div className="page-container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="page-header-title">Manajemen Pengguna</h2>
                        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Kelola akses pelapor, operator unit, dan administrator sistem.</p>
                    </div>
                    <div>
                        <button onClick={openAddModal} className="btn btn-primary">
                            + Tambah Pengguna
                        </button>
                    </div>
                </div>

                <div className="card shadow-md">
                    <div className="card-body p-0">
                        <DataTable 
                            columns={columns} 
                            data={users.data || users} 
                            pagination={users} 
                            searchable={true} 
                            searchPlaceholder="Cari nama, email, telepon..." 
                        />
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Pengguna" maxWidth="md">
                <form onSubmit={handleAddSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Pengguna Baru</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alamat Email</label>
                        <input
                            type="email"
                            className={`form-input ${errors.email ? 'border-danger' : ''}`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-danger mt-1 text-sm">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nomor WhatsApp/Telepon (Opsional)</label>
                        <input
                            type="text"
                            className={`form-input ${errors.phone ? 'border-danger' : ''}`}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && <div className="text-danger mt-1 text-sm">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Peran (Role)</label>
                        <select
                            className={`form-select ${errors.role ? 'border-danger' : ''}`}
                            value={data.role}
                            onChange={(e) => {
                                setData('role', e.target.value);
                                if (e.target.value !== 'operator') {
                                    setData('unit_id', '');
                                }
                            }}
                        >
                            <option value="pelapor">Pelapor (Masyarakat)</option>
                            <option value="operator">Operator (Admin Unit)</option>
                            <option value="admin">Administrator</option>
                        </select>
                        {errors.role && <div className="text-danger mt-1 text-sm">{errors.role}</div>}
                    </div>

                    {data.role === 'operator' && (
                        <div className="form-group">
                            <label className="form-label">Tugaskan ke Unit Kerja</label>
                            <select
                                className={`form-select ${errors.unit_id ? 'border-danger' : ''}`}
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', e.target.value)}
                            >
                                <option value="">-- Pilih Unit Kerja --</option>
                                {(units || []).map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                            {errors.unit_id && <div className="text-danger mt-1 text-sm">{errors.unit_id}</div>}
                        </div>
                    )}

                    <div className="alert alert-info mt-4" style={{ fontSize: '0.875rem' }}>
                        Password bawaan untuk pengguna baru adalah <strong>password123</strong>. Pengguna disarankan untuk mengubahnya setelah login pertama.
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="btn btn-primary">
                            {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Pengguna" maxWidth="md">
                <form onSubmit={handleEditSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Edit Pengguna</h2>
                    
                    <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                            type="text"
                            className={`form-input ${errors.name ? 'border-danger' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-danger mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alamat Email</label>
                        <input
                            type="email"
                            className={`form-input ${errors.email ? 'border-danger' : ''}`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-danger mt-1 text-sm">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nomor WhatsApp/Telepon (Opsional)</label>
                        <input
                            type="text"
                            className={`form-input ${errors.phone ? 'border-danger' : ''}`}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && <div className="text-danger mt-1 text-sm">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Peran (Role)</label>
                        <select
                            className={`form-select ${errors.role ? 'border-danger' : ''}`}
                            value={data.role}
                            onChange={(e) => {
                                setData('role', e.target.value);
                                if (e.target.value !== 'operator') {
                                    setData('unit_id', '');
                                }
                            }}
                        >
                            <option value="pelapor">Pelapor (Masyarakat)</option>
                            <option value="operator">Operator (Admin Unit)</option>
                            <option value="admin">Administrator</option>
                        </select>
                        {errors.role && <div className="text-danger mt-1 text-sm">{errors.role}</div>}
                    </div>

                    {data.role === 'operator' && (
                        <div className="form-group">
                            <label className="form-label">Tugaskan ke Unit Kerja</label>
                            <select
                                className={`form-select ${errors.unit_id ? 'border-danger' : ''}`}
                                value={data.unit_id}
                                onChange={(e) => setData('unit_id', e.target.value)}
                            >
                                <option value="">-- Pilih Unit Kerja --</option>
                                {(units || []).map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                            {errors.unit_id && <div className="text-danger mt-1 text-sm">{errors.unit_id}</div>}
                        </div>
                    )}

                    <div className="form-group mt-4">
                        <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <span>Akun Pengguna Aktif (Dapat Login)</span>
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

            {/* Reset Password Modal */}
            <Modal show={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                    <h2 className="text-lg font-bold mb-2">Reset Password?</h2>
                    <p className="text-secondary mb-6">
                        Apakah Anda yakin ingin melakukan reset password untuk <strong>{selectedUser?.name}</strong>? Password baru mereka akan dikembalikan ke pengaturan awal yaitu: <br/><br/><strong style={{ padding: '0.5rem', background: '#f4f4f4', borderRadius: '0.25rem' }}>password123</strong>
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsResetModalOpen(false)} className="btn btn-outline">
                            Batal
                        </button>
                        <button type="button" onClick={handleResetPassword} className="btn btn-warning" style={{ background: 'var(--warning)', color: 'white' }}>
                            Ya, Reset Password
                        </button>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
