import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32' }, // Name
  { width: 'w-24' }, // Provider
  { width: 'w-24' }, // Created
];

export function AccountTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={2} />;
}
