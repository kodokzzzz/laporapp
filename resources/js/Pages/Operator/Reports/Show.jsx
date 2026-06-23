import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import Timeline from '@/Components/Timeline';
import PrimaryButton from '@/Components/PrimaryButton';
import Toast from '@/Components/Toast';
import { useState } from 'react';

export default function Show({ report, availableOperators = [] }) {
    const { auth } = usePage().props;
    const [toast, setToast] = useState(null);

    const { data, setData, post, processing } = useForm({
        status: report.status,
        notes: '',
        priority: report.priority,
        assigned_to: report.assigned_to || '',
    });

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        post(route('operator.reports.status', report.id), {
            onSuccess: () => {
                setToast({ message: 'Status laporan berhasil diperbarui.', type: 'success' });
                setData('notes', '');
            },
        });
    };

    const handleAssign = () => {
        post(route('operator.reports.assign', report.id), {
            onSuccess: () => setToast({ message: 'Petugas berhasil ditugaskan.', type: 'success' }),
        });
    };

    const backUrl = auth.user.role === 'admin' ? route('admin.reports.index') : route('operator.reports.index');

    return (
        <AuthenticatedLayout header="Detail Laporan">
            <Head title={`Laporan ${report.ticket_number}`} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="page-container">
                <div style={{ marginBottom: '1rem' }}>
                    <Link href={backUrl} className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                        ⬅️ Kembali ke Daftar Laporan
                    </Link>
                </div>
                
                <div className="page-header">
                    <div>
                        <h2 className="page-header-title">Detail Laporan</h2>
                        <p className="page-header-subtitle">Tiket: {report.ticket_number}</p>
                    </div>
                    <div className="page-header-actions">
                        <StatusBadge status={report.status} />
                        <PriorityBadge priority={report.priority} />
                    </div>
                </div>

                <div className="grid grid-cols-3">
                    <div className="col-span-2 space-y-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Informasi Laporan</h3>
                            </div>
                            <div className="card-body">
                                <h4 className="heading-4 mb-sm">{report.title}</h4>
                                <p className="body-text mb-lg whitespace-pre-wrap">{report.description}</p>
                                
                                <div className="grid grid-cols-2 gap-md mt-lg pt-md border-t border-gray-200">
                                    <div>
                                        <p className="caption">Kategori</p>
                                        <p className="font-medium">{report.category?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="caption">Lokasi Kejadian</p>
                                        <p className="font-medium">{report.location || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="caption">Tanggal Kejadian</p>
                                        <p className="font-medium">{report.incident_date || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="caption">Pelapor</p>
                                        <p className="font-medium">{report.is_anonymous ? 'Anonim' : report.user?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Tindak Lanjut & Update Status</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">Ubah Status</label>
                                        <select
                                            className="form-select"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="diterima">Diterima</option>
                                            <option value="diverifikasi">Diverifikasi</option>
                                            <option value="diproses">Diproses</option>
                                            <option value="selesai">Selesai</option>
                                            <option value="ditolak">Ditolak</option>
                                            <option value="diteruskan">Diteruskan</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Catatan Tindak Lanjut / Alasan</label>
                                        <textarea
                                            className="form-textarea"
                                            rows="3"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Masukkan catatan status..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end">
                                        <PrimaryButton type="submit" disabled={processing}>Update Status</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Penugasan</h3>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Tugaskan ke Operator</label>
                                    <select
                                        className="form-select"
                                        value={data.assigned_to}
                                        onChange={(e) => setData('assigned_to', e.target.value)}
                                    >
                                        <option value="">-- Pilih Petugas --</option>
                                        {availableOperators.map(op => (
                                            <option key={op.id} value={op.id}>{op.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <PrimaryButton className="w-full justify-center" onClick={handleAssign} disabled={processing}>Simpan Penugasan</PrimaryButton>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Riwayat Status</h3>
                            </div>
                            <div className="card-body">
                                <Timeline
                                    items={report.status_logs?.map(log => ({
                                        status: log.to_status,
                                        date: log.created_at,
                                        user: log.changed_by?.name,
                                        notes: log.notes
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
