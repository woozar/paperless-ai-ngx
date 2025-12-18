import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-96' }, // Title
  { width: 'w-20', height: 'h-5' }, // Status (Badge)
  { width: 'w-14' }, // Document Date
  { width: 'w-14' }, // Updated At
];

export function DocumentTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={1} />;
}
