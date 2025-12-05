import { TableSkeleton } from '@/components/table-skeleton';

const columns = [
  { width: 'w-32', height: 'h-5' }, // Username
  { width: 'w-16', height: 'h-5' }, // Role
  { width: 'w-16', height: 'h-5' }, // Status
  { width: 'w-28', height: 'h-5' }, // Created
];

type UserTableSkeletonProps = Readonly<{
  rows?: number;
}>;

export function UserTableSkeleton({ rows = 5 }: UserTableSkeletonProps) {
  return <TableSkeleton columns={columns} rows={rows} baseButtonCount={3} />;
}
