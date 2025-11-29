import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

describe('Table', () => {
  it('renders a basic table structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Header' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Cell' })).toBeInTheDocument();
  });

  it('renders TableCaption', () => {
    render(
      <Table>
        <TableCaption>Table description</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Table description')).toBeInTheDocument();
  });

  it('renders TableFooter', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Body Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="footer">
          <TableRow>
            <TableCell>Footer Cell</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Footer Cell')).toBeInTheDocument();
  });

  it('applies custom className to Table', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('custom-table');
  });

  it('applies custom className to TableHeader', () => {
    render(
      <Table>
        <TableHeader className="custom-header" data-testid="header">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId('header')).toHaveClass('custom-header');
  });

  it('applies custom className to TableBody', () => {
    render(
      <Table>
        <TableBody className="custom-body" data-testid="body">
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId('body')).toHaveClass('custom-body');
  });

  it('applies custom className to TableFooter', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="custom-footer" data-testid="footer">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
  });

  it('applies custom className to TableRow', () => {
    render(
      <Table>
        <TableBody>
          <TableRow className="custom-row" data-testid="row">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId('row')).toHaveClass('custom-row');
  });

  it('applies custom className to TableHead', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="custom-head">Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('columnheader')).toHaveClass('custom-head');
  });

  it('applies custom className to TableCell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="custom-cell">Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('cell')).toHaveClass('custom-cell');
  });

  it('applies custom className to TableCaption', () => {
    render(
      <Table>
        <TableCaption className="custom-caption">Caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Caption')).toHaveClass('custom-caption');
  });

  it('renders multiple rows and columns', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Inactive</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header row + 2 body rows
    expect(screen.getAllByRole('cell')).toHaveLength(6);
  });

  it('wraps table in overflow container', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table');
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
  });

  it('applies data-slot attributes to all components', () => {
    render(
      <Table>
        <TableHeader data-testid="header">
          <TableRow data-testid="header-row">
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="body">
          <TableRow data-testid="body-row">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'table-header');
    expect(screen.getByTestId('body')).toHaveAttribute('data-slot', 'table-body');
    expect(screen.getByTestId('header-row')).toHaveAttribute('data-slot', 'table-row');
    expect(screen.getByTestId('body-row')).toHaveAttribute('data-slot', 'table-row');
    expect(screen.getByRole('columnheader')).toHaveAttribute('data-slot', 'table-head');
    expect(screen.getByRole('cell')).toHaveAttribute('data-slot', 'table-cell');
  });
});
