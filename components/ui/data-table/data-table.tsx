"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export type Column<T> = {
  key: string;
  header?: React.ReactNode;
  accessor?: (row: T) => any;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

type SortState = { key: string | null; dir: 'asc' | 'desc' | null };

export function DataTable<T extends Record<string, any>>(props: {
  columns: Column<T>[];
  data: T[];
  className?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onRowClick?: (row: T) => void;
}) {
  const { columns, data, className, pageSizeOptions = [10, 25, 50], defaultPageSize = 25, onRowClick } = props;

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [sort, setSort] = React.useState<SortState>({ key: null, dir: null });

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setPage(1);
    setSort(prev => {
      if (prev.key !== col.key) return { key: col.key, dir: 'asc' };
      if (prev.dir === 'asc') return { key: col.key, dir: 'desc' };
      return { key: null, dir: null };
    });
  };

  const sorted = React.useMemo(() => {
    if (!sort.key || !sort.dir) return data.slice();
    const col = columns.find(c => c.key === sort.key);
    if (!col) return data.slice();
    const accessor = col.accessor || ((r: any) => r[sort.key!]);
    return data.slice().sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av == null && bv == null) return 0;
      if (av == null) return sort.dir === 'asc' ? -1 : 1;
      if (bv == null) return sort.dir === 'asc' ? 1 : -1;
      if (typeof av === 'number' && typeof bv === 'number') return sort.dir === 'asc' ? av - bv : bv - av;
      return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [data, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = React.useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page, pageSize]);

  React.useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  return (
    <div className={cn('w-full', className || '')}>
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b">
              {columns.map(col => (
                <th key={col.key} className={cn('p-4', col.width || '')} onClick={() => handleSort(col)}>
                  <div className="flex items-center gap-2">
                    <span>{col.header ?? col.key}</span>
                    {col.sortable && sort.key === col.key && sort.dir && (
                      <span className="text-xs">{sort.dir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td className="p-6 text-center text-muted-foreground" colSpan={columns.length}>No results</td></tr>
            ) : paginated.map((row, i) => (
              <tr key={i} className="border-b hover:bg-muted cursor-pointer" onClick={() => onRowClick?.(row)}>
                {columns.map(col => (
                  <td key={col.key} className="p-4 align-top">
                    {col.cell ? col.cell(row) : String(col.accessor ? col.accessor(row) : (row as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Per page:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="text-sm">
            {pageSizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Previous</button>
          <div className="text-sm">Page {page} / {totalPages}</div>
          <button className="btn btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
