/**
 * DataTable Component
 *
 * A full-featured data table with column sorting, search input,
 * filter dropdowns, pagination, loading skeleton, and empty state.
 *
 * @param {Array} columns - Column definitions:
 *   { key: string, label: string, sortable: boolean, render: (value, row) => ReactNode }
 * @param {Array} data - Array of row data objects
 * @param {boolean} searchable - Show search input (default: true)
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {Array} filters - Filter definitions:
 *   { key: string, label: string, options: [{value, label}] }
 * @param {function} onSearch - Callback when search value changes: (searchValue) => void
 * @param {function} onFilter - Callback when a filter changes: (filterKey, filterValue) => void
 * @param {function} onSort - Callback when sort changes: (columnKey, direction) => void
 * @param {Object} pagination - Pagination info:
 *   { current_page, last_page, per_page, total }
 * @param {function} onPageChange - Callback when page changes: (page) => void
 * @param {string} emptyMessage - Message for empty state
 * @param {boolean} loading - Whether to show loading skeleton
 * @param {string} className - Additional CSS classes
 */

import { useState, useMemo } from 'react';
import SearchInput from './SearchInput';
import EmptyState from './EmptyState';

export default function DataTable({
    columns = [],
    data = [],
    searchable = true,
    searchPlaceholder = 'Cari data...',
    filters = [],
    onSearch,
    onFilter,
    onSort,
    pagination,
    onPageChange,
    emptyMessage = 'Tidak ada data yang ditemukan.',
    loading = false,
    className = '',
}) {
    const [searchValue, setSearchValue] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [activeFilters, setActiveFilters] = useState({});

    /**
     * Handle column header click for sorting.
     */
    const handleSort = (column) => {
        if (!column.sortable) return;

        let newDirection = 'asc';
        if (sortColumn === column.key) {
            newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }

        setSortColumn(column.key);
        setSortDirection(newDirection);
        onSort?.(column.key, newDirection);
    };

    /**
     * Handle search input change.
     */
    const handleSearch = (value) => {
        setSearchValue(value);
        onSearch?.(value);
    };

    /**
     * Handle filter dropdown change.
     */
    const handleFilterChange = (filterKey, value) => {
        const updated = { ...activeFilters, [filterKey]: value };
        setActiveFilters(updated);
        onFilter?.(filterKey, value);
    };

    /**
     * Render sort indicator arrow.
     */
    const renderSortIcon = (column) => {
        if (!column.sortable) return null;

        const isActive = sortColumn === column.key;

        return (
            <span className={`data-table-sort-icon ${isActive ? 'data-table-sort-active' : ''}`}>
                {isActive ? (
                    sortDirection === 'asc' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
                        <polyline points="8 9 12 5 16 9" />
                        <polyline points="16 15 12 19 8 15" />
                    </svg>
                )}
            </span>
        );
    };

    /**
     * Build pagination page numbers with ellipsis.
     */
    const pageNumbers = useMemo(() => {
        if (!pagination) return [];

        const { current_page, last_page } = pagination;
        const pages = [];
        const maxVisible = 5;

        if (last_page <= maxVisible + 2) {
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            pages.push(1);

            let start = Math.max(2, current_page - 1);
            let end = Math.min(last_page - 1, current_page + 1);

            if (current_page <= 3) {
                start = 2;
                end = maxVisible;
            } else if (current_page >= last_page - 2) {
                start = last_page - maxVisible + 1;
                end = last_page - 1;
            }

            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < last_page - 1) pages.push('...');

            pages.push(last_page);
        }

        return pages;
    }, [pagination]);

    /**
     * Loading skeleton rows.
     */
    const renderSkeleton = () => (
        <>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="data-table-skeleton-row">
                    {columns.map((col, colIndex) => (
                        <td key={`skeleton-${rowIndex}-${colIndex}`} className="data-table-cell">
                            <div className="data-table-skeleton-cell" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );

    return (
        <div className={`data-table ${className}`.trim()}>
            {/* Toolbar: search + filters */}
            {(searchable || filters.length > 0) && (
                <div className="data-table-toolbar">
                    {searchable && (
                        <div className="data-table-search">
                            <SearchInput
                                value={searchValue}
                                onChange={handleSearch}
                                onClear={() => handleSearch('')}
                                placeholder={searchPlaceholder}
                                debounceMs={300}
                            />
                        </div>
                    )}

                    {filters.length > 0 && (
                        <div className="data-table-filters">
                            {filters.map((filter) => (
                                <div key={filter.key} className="data-table-filter">
                                    <select
                                        className="data-table-filter-select"
                                        value={activeFilters[filter.key] || ''}
                                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                        aria-label={filter.label}
                                    >
                                        <option value="">{filter.label}</option>
                                        {filter.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="data-table-wrapper">
                <table className="data-table-table">
                    <thead className="data-table-thead">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`data-table-th ${column.sortable ? 'data-table-th-sortable' : ''} ${
                                        sortColumn === column.key ? 'data-table-th-sorted' : ''
                                    }`}
                                    onClick={() => handleSort(column)}
                                    role={column.sortable ? 'button' : undefined}
                                    tabIndex={column.sortable ? 0 : undefined}
                                    onKeyDown={(e) => {
                                        if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            handleSort(column);
                                        }
                                    }}
                                    aria-sort={
                                        sortColumn === column.key
                                            ? sortDirection === 'asc'
                                                ? 'ascending'
                                                : 'descending'
                                            : undefined
                                    }
                                >
                                    <span className="data-table-th-content">
                                        {column.label}
                                        {renderSortIcon(column)}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="data-table-tbody">
                        {loading ? (
                            renderSkeleton()
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="data-table-empty-cell">
                                    <EmptyState
                                        icon="🔍"
                                        title="Data Tidak Ditemukan"
                                        description={emptyMessage}
                                    />
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex} className="data-table-row">
                                    {columns.map((column) => (
                                        <td key={column.key} className="data-table-cell">
                                            {column.render
                                                ? column.render(row[column.key], row, rowIndex)
                                                : row[column.key] ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="data-table-pagination">
                    <div className="data-table-pagination-info">
                        Menampilkan{' '}
                        <strong>
                            {(pagination.current_page - 1) * pagination.per_page + 1}
                        </strong>{' '}
                        -{' '}
                        <strong>
                            {Math.min(
                                pagination.current_page * pagination.per_page,
                                pagination.total
                            )}
                        </strong>{' '}
                        dari <strong>{pagination.total.toLocaleString('id-ID')}</strong> data
                    </div>

                    <nav className="data-table-pagination-nav" aria-label="Navigasi halaman">
                        {/* Previous button */}
                        <button
                            type="button"
                            className="data-table-pagination-btn data-table-pagination-prev"
                            onClick={() => onPageChange?.(pagination.current_page - 1)}
                            disabled={pagination.current_page <= 1}
                            aria-label="Halaman sebelumnya"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        {pageNumbers.map((page, index) =>
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="data-table-pagination-ellipsis">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    type="button"
                                    className={`data-table-pagination-btn ${
                                        page === pagination.current_page
                                            ? 'data-table-pagination-btn-active'
                                            : ''
                                    }`}
                                    onClick={() => onPageChange?.(page)}
                                    aria-label={`Halaman ${page}`}
                                    aria-current={page === pagination.current_page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        {/* Next button */}
                        <button
                            type="button"
                            className="data-table-pagination-btn data-table-pagination-next"
                            onClick={() => onPageChange?.(pagination.current_page + 1)}
                            disabled={pagination.current_page >= pagination.last_page}
                            aria-label="Halaman selanjutnya"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
