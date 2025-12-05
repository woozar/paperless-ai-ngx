import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32' }, // Name
  { width: 'w-24' }, // Type
  { width: 'w-32' }, // Model
  { width: 'w-16' }, // Status
  { width: 'w-24' }, // Created
];

export function ProviderTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={2} />;
}
