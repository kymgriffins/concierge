import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable, { Column } from '@/components/ui/data-table/data-table';

type Row = { id: string; name: string; value: number };

describe('DataTable', () => {
  const data: Row[] = [
    { id: '1', name: 'Alpha', value: 10 },
    { id: '2', name: 'Bravo', value: 5 },
    { id: '3', name: 'Charlie', value: 20 }
  ];

  const columns: Column<Row>[] = [
    { key: 'name', header: 'Name', accessor: r => r.name, sortable: true },
    { key: 'value', header: 'Value', accessor: r => r.value, sortable: true }
  ];

  it('renders rows and supports sorting', () => {
    render(<DataTable columns={columns} data={data} defaultPageSize={10} />);
    expect(screen.getByText('Alpha')).toBeDefined();
    // Sort by Value ascending
    const valueHeader = screen.getByText('Value');
    fireEvent.click(valueHeader);
    // After sort asc, first row should be Bravo (value 5)
    const firstRow = screen.getAllByRole('row')[1];
    expect(firstRow.textContent).toContain('Bravo');
    // Toggle sort to desc
    fireEvent.click(valueHeader);
    const firstRowDesc = screen.getAllByRole('row')[1];
    expect(firstRowDesc.textContent).toContain('Charlie');
  });
});
