import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32' }, // Name
  { width: 'w-48' }, // URL
  { width: 'w-16' }, // Status
  { width: 'w-24' }, // Created
];

export function InstanceTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={3} />;
}
