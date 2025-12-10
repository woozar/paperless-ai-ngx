import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32' }, // Name
  { width: 'w-32' }, // Model Identifier
  { width: 'w-24' }, // AI Account
  { width: 'w-24' }, // Created
];

export function ModelTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={2} />;
}
