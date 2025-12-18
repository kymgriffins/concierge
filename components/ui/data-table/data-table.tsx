"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download } from 'lucide-react';

export type Column<T> = {
  key: string;
  header?: React.ReactNode;
  accessor?: (row: T) => any;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  hidden?: boolean;
};

type SortState = { key: string | null; dir: 'asc' | 'desc' | null };
type FilterState = { [key: string]: string };

export interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  exportable?: boolean;
  onExport?: (data: T[], format: 'csv' | 'json') => void;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const {
    columns,
    data,
    className,
    pageSizeOptions = [10, 25, 50, 100],
    defaultPageSize = 25,
    onRowClick,
    searchable = false,
    exportable = false,
    onExport,
    defaultSort,
    onSortChange,
    emptyMessage = 'No results found'
  } = props;

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [sort, setSort] = React.useState<SortState>(defaultSort || { key: null, dir: null });
  const [filters, setFilters] = React.useState<FilterState>({});
  const [searchTerm, setSearchTerm] = React.useState('');

  const visibleColumns = columns.filter(col => !col.hidden);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setPage(1);
    const newSort = sort.key !== col.key
      ? { key: col.key, dir: 'asc' as const }
      : sort.dir === 'asc'
        ? { key: col.key, dir: 'desc' as const }
        : { key: null, dir: null };
    setSort(newSort);
    onSortChange?.(newSort);
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const exportData = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(filteredData, format);
    } else {
      // Default export implementation
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const headers = visibleColumns.map(col => col.header || col.key).join(',');
        const rows = filteredData.map(row =>
          visibleColumns.map(col =>
            String(col.accessor ? col.accessor(row) : (row as any)[col.key] ?? '')
          ).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const filteredData = React.useMemo(() => {
    let result = data.slice();

    // Apply search
    if (searchTerm) {
      result = result.filter(row =>
        visibleColumns.some(col => {
          const value = col.accessor ? col.accessor(row) : (row as any)[col.key];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const col = columns.find(c => c.key === key);
          if (!col) return true;
          const value = col.accessor ? col.accessor(row) : (row as any)[key];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sort.key && sort.dir) {
      const col = columns.find(c => c.key === sort.key);
      if (col) {
        const accessor = col.accessor || ((r: any) => r[sort.key!]);
        result.sort((a, b) => {
          const av = accessor(a);
          const bv = accessor(b);
          if (av == null && bv == null) return 0;
          if (av == null) return sort.dir === 'asc' ? -1 : 1;
          if (bv == null) return sort.dir === 'asc' ? 1 : -1;
          if (typeof av === 'number' && typeof bv === 'number') return sort.dir === 'asc' ? av - bv : bv - av;
          return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
      }
    }

    return result;
  }, [data, sort, filters, searchTerm, visibleColumns, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = React.useMemo(() =>
    filteredData.slice((page - 1) * pageSize, page * pageSize),
    [filteredData, page, pageSize]
  );

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const getSortIcon = (colKey: string) => {
    if (sort.key !== colKey) return <ArrowUpDown className="h-4 w-4" />;
    if (sort.dir === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sort.dir === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className={cn('w-full space-y-4', className || '')}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {exportable && (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b bg-muted/50">
                {visibleColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'p-4',
                      col.width || '',
                      col.sortable ? 'cursor-pointer hover:bg-muted/70' : ''
                    )}
                    onClick={() => col.sortable && handleSort(col)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{col.header ?? col.key}</span>
                      {col.sortable && getSortIcon(col.key)}
                    </div>

                    {/* Column filters */}
                    {col.filterable && (
                      <Input
                        placeholder={`Filter ${col.header || col.key}...`}
                        value={filters[col.key] || ''}
                        onChange={(e) => handleFilter(col.key, e.target.value)}
                        className="mt-2 h-8 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-muted-foreground" colSpan={visibleColumns.length}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b hover:bg-muted/50 transition-colors",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map(col => (
                    <td key={col.key} className="p-4 align-top">
                      {col.cell ? col.cell(row) : String(col.accessor ? col.accessor(row) : (row as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(opt => (
                  <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredData.length === 0
              ? 'No results'
              : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredData.length)} of ${filteredData.length} results`
            }
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
