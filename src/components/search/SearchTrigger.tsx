'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchOverlay from '@/components/search/SearchOverlay';

export default function SearchTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: '#003591',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 40,
          boxShadow: '0 4px 16px rgba(0,53,145,0.45)',
          transition: 'transform 120ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Search size={20} strokeWidth={2} color="#fff" />
      </button>

      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
