import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32' }, // Name
  { width: 'w-24' }, // Provider
  { width: 'w-16', height: 'h-5' }, // Status (Badge)
  { width: 'w-28' }, // Created
];

export function BotTableSkeleton() {
  return <TableSkeleton columns={columns} baseButtonCount={2} />;
}
