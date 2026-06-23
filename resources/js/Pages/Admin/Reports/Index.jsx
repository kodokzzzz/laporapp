import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import React, { useState, useEffect } from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', margin: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', background: '#fef2f2', padding: '1rem', borderRadius: '0.25rem' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ReportIndex({ 
    reports = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0 }, 
    filters = {}, 
    statuses = {}, 
    priorities = {}, 
    categories = [], 
    units = [] 
}) {
    const safeFilters = (Array.isArray(filters) ? {} : filters) || {};
    const [search, setSearch] = useState(safeFilters.search || '');
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (safeFilters.search || '')) {
                router.get(route('admin.reports.index'), { ...safeFilters, search }, { preserveState: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, safeFilters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...safeFilters };
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        router.get(route('admin.reports.index'), newFilters, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        router.get(route('admin.reports.index'));
    };

    const hasActiveFilters = Object.keys(safeFilters).filter(k => k !== 'page' && k !== 'sort' && k !== 'direction').length > 0;

    const columns = [
        {
            key: 'ticket_number',
            label: 'Nomor Tiket',
            render: (_, row) => (
                <div>
                    <Link href={route('operator.reports.show', row.id || '')} style={{ fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>
                        {row.ticket_number || '-'}
                    </Link>
                    {row.type && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {row.type === 'pengaduan' ? 'Pengaduan' : row.type === 'aspirasi' ? 'Aspirasi' : 'Permintaan Info'}
                        </div>
                    )}
                </div>
            ),
        },
        { 
            key: 'title', 
            label: 'Judul & Pelapor', 
            render: (_, row) => (
                <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.2rem' }} className="line-clamp-2">{row.title || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        👤 {row.is_anonymous ? 'Anonim' : (row.user?.name || row.guest_name || 'Guest')} 
                        {row.is_secret && <span style={{ marginLeft: '0.5rem', color: 'var(--danger)' }}>🔒 Rahasia</span>}
                    </div>
                </div>
            )
        },
        { 
            key: 'category', 
            label: 'Kategori / Unit', 
            render: (_, row) => (
                <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>🏷️ {row.category?.name || '-'}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>🏢 {row.unit?.name || 'Belum diassign'}</div>
                </div>
            ) 
        },
        { key: 'status', label: 'Status', render: (_, row) => <StatusBadge status={row.status || 'diterima'} /> },
        { key: 'priority', label: 'Prioritas', render: (_, row) => <PriorityBadge priority={row.priority || 'sedang'} /> },
        { 
            key: 'created_at', 
            label: 'Tanggal Masuk', 
            render: (_, row) => (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>
            ) 
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_, row) => (
                <Link href={route('operator.reports.show', row.id || '')} className="btn btn-primary btn-sm">
                    Detail
                </Link>
            )
        }
    ];

    return (
        <AuthenticatedLayout header="Semua Laporan (Admin)">
            <Head title="Manajemen Laporan — Admin LAPOR!" />
            
            <div className="page-container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="page-header-title">Manajemen Seluruh Laporan</h2>
                        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Pantau, saring, dan kelola semua laporan yang masuk ke dalam sistem.</p>
                    </div>
                </div>

                <div className="card shadow-sm" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cari Laporan</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Nomor tiket, judul, pelapor..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                                <select 
                                    className="form-select" 
                                    value={safeFilters.status || ''} 
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    {Object.entries(statuses || {}).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Tujuan</label>
                                <select 
                                    className="form-select" 
                                    value={safeFilters.unit || ''} 
                                    onChange={(e) => handleFilterChange('unit', e.target.value)}
                                >
                                    <option value="">Semua Unit</option>
                                    {(units || []).map((unit) => (
                                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori</label>
                                <select 
                                    className="form-select" 
                                    value={safeFilters.category || ''} 
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">Semua Kategori</option>
                                    {(categories || []).map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <button onClick={clearFilters} className="btn btn-outline btn-sm text-danger" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                                    × Hapus Semua Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card shadow-md">
                    <div className="card-body p-0">
                        <DataTable
                            columns={columns}
                            data={reports?.data || []}
                            pagination={reports}
                            searchable={false}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default function Index(props) {
    return (
        <ErrorBoundary>
            <ReportIndex {...props} />
        </ErrorBoundary>
    );
}
