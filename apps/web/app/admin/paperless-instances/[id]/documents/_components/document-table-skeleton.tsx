import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-64' }, // Title
  { width: 'w-20', height: 'h-5' }, // Status (Badge)
  { width: 'w-28' }, // Imported At
];

export function DocumentTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={1} />;
}
