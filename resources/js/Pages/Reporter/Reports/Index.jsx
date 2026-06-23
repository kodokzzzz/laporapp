import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import SearchInput from '@/Components/SearchInput';
import EmptyState from '@/Components/EmptyState';
import { useState, useCallback } from 'react';

export default function Index({
    reports = { data: [], links: [], meta: {} },
    filters = {},
    categories = [],
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [category, setCategory] = useState(filters.category || '');

    const applyFilters = useCallback((newFilters) => {
        const params = {
            search: newFilters.search ?? search,
            status: newFilters.status ?? status,
            category: newFilters.category ?? category,
        };
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get(route('reporter.reports.index'), params, { preserveState: true, preserveScroll: true });
    }, [search, status, category]);

    const handleSearch = (val) => {
        setSearch(val);
        applyFilters({ search: val });
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        applyFilters({ status: e.target.value });
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        applyFilters({ category: e.target.value });
    };

    const reportList = Array.isArray(reports) ? reports : (reports.data || []);
    const paginationLinks = reports.links || [];

    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'diterima', label: 'Diterima' },
        { value: 'diverifikasi', label: 'Diverifikasi' },
        { value: 'diproses', label: 'Sedang Diproses' },
        { value: 'selesai', label: 'Selesai' },
        { value: 'ditolak', label: 'Ditolak' },
        { value: 'diteruskan', label: 'Diteruskan' },
    ];

    return (
        <AuthenticatedLayout header="Laporan Saya">
            <Head title="Laporan Saya" />

            <div className="page-container">
                {/* Filters */}
                <div className="filters-bar">
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Cari judul atau nomor tiket..."
                        debounceMs={400}
                        className="filters-search"
                    />
                    <div className="filters-selects">
                        <select className="form-select" value={status} onChange={handleStatusChange}>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select className="form-select" value={category} onChange={handleCategoryChange}>
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                {reportList.length > 0 ? (
                    <div className="card">
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>No. Tiket</th>
                                        <th>Judul</th>
                                        <th>Kategori</th>
                                        <th>Status</th>
                                        <th>Prioritas</th>
                                        <th>Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportList.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="table-row-clickable"
                                            onClick={() => router.visit(route('reporter.reports.show', report.id))}
                                        >
                                            <td>
                                                <span className="ticket-mono">{report.ticket_number}</span>
                                            </td>
                                            <td>
                                                <span className="table-title">{report.title}</span>
                                            </td>
                                            <td>{report.category?.name || '-'}</td>
                                            <td>
                                                <StatusBadge status={report.status} showIcon={false} />
                                            </td>
                                            <td>
                                                <PriorityBadge priority={report.priority} showIcon={false} />
                                            </td>
                                            <td className="table-date">
                                                {report.created_at
                                                    ? new Date(report.created_at).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {paginationLinks.length > 3 && (
                            <div className="pagination">
                                {paginationLinks.map((link, idx) => (
                                    <button
                                        key={idx}
                                        className={`pagination-btn ${link.active ? 'pagination-btn-active' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon="📭"
                        title="Belum ada laporan"
                        description="Anda belum membuat laporan apapun. Mulai dengan membuat laporan pertama Anda."
                        action={{ label: 'Buat Laporan', href: route('reporter.reports.create') }}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
