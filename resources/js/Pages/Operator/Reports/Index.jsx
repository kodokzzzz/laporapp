import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';

export default function Index({ reports }) {
    const columns = [
        {
            key: 'ticket_number',
            label: 'Nomor Tiket',
            render: (row) => (
                <Link href={route('operator.reports.show', row.id)} className="font-medium text-primary hover:underline">
                    {row.ticket_number}
                </Link>
            ),
        },
        {
            key: 'title',
            label: 'Judul Laporan',
            render: (row) => (
                <div className="max-w-xs truncate" title={row.title}>
                    {row.title}
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Kategori',
            render: (row) => row.category?.name || '-',
        },
        {
            key: 'priority',
            label: 'Prioritas',
            render: (row) => <PriorityBadge priority={row.priority} />,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: 'created_at',
            label: 'Tanggal Masuk',
            render: (row) => new Date(row.created_at).toLocaleDateString('id-ID'),
        },
    ];

    return (
        <AuthenticatedLayout header="Semua Laporan">
            <Head title="Semua Laporan" />
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h2 className="page-header-title">Daftar Laporan Masyarakat</h2>
                        <p className="page-header-subtitle">Daftar semua laporan yang masuk ke unit Anda.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body p-0">
                        <DataTable
                            columns={columns}
                            data={reports.data}
                            pagination={reports}
                            searchable={true}
                            searchPlaceholder="Cari tiket, judul..."
                            emptyMessage="Tidak ada laporan yang ditemukan."
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
