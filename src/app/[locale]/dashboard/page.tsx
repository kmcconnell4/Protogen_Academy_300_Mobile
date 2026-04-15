import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700 }}>
        {t('greeting', { name: '...' })}
      </h1>
    </main>
  );
}
