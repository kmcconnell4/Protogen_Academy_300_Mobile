import StatCard from '@/components/ui/StatCard';
import type { Job, Order } from '@/lib/mock/types';
import { useTranslations } from 'next-intl';

interface StatGridProps {
  jobs: Job[];
  orders: Order[];
}

export default function StatGrid({ jobs, orders }: StatGridProps) {
  const t = useTranslations('dashboard');

  const activeJobs = jobs.filter(j => j.status === 'In Progress').length;
  const pendingOrders = orders.filter(o => o.status === 'Submitted' || o.status === 'Confirmed').length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}
    >
      <StatCard label={t('activeJobs')} value={activeJobs} color="#4D8AFF" />
      <StatCard label={t('pendingOrders')} value={pendingOrders} />
      <StatCard label={t('unread')} value={12} />
    </div>
  );
}
