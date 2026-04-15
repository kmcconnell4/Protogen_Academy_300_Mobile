'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const isOffline = !navigator.onLine;
      setOffline(isOffline);
      if (isOffline) setVisible(true);
    };

    // Set initial state
    update();

    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // When coming back online, animate out after a short delay
  useEffect(() => {
    if (!offline && visible) {
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [offline, visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '48px',
        background: offline ? 'rgba(217,119,6,0.92)' : 'rgba(27,127,79,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        animation: 'bannerSlideDown 220ms ease forwards',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <WifiOff size={16} strokeWidth={2} color="#fff" />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#fff',
          fontFamily: 'var(--font-body)',
        }}
      >
        {offline
          ? "You're offline — changes will sync when reconnected"
          : 'Back online'}
      </span>

      <style>{`
        @keyframes bannerSlideDown {
          from { transform: translateY(-48px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
