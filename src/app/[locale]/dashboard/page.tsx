import { Suspense } from 'react';
import { getJobs } from '@/lib/api/jobs';
import { getOrders } from '@/lib/api/orders';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { SkeletonCard } from '@/components/ui/Skeleton';

async function DashboardData() {
  const [jobs, orders] = await Promise.all([getJobs(), getOrders()]);
  return <DashboardClient jobs={jobs} orders={orders} />;
}

function DashboardSkeleton() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
