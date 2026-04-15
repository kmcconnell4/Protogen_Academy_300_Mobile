import { Check } from 'lucide-react';
import type { Order } from '@/lib/mock/types';

interface OrderTimelineProps {
  order: Order;
}

const STEPS: Order['status'][] = ['Submitted', 'Confirmed', 'Shipped', 'Delivered'];

const STEP_INDEX: Record<Order['status'], number> = {
  Submitted: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
};

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const currentIndex = STEP_INDEX[order.status];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}
    >
      {STEPS.map((step, i) => {
        const completed = i < currentIndex;
        const active = i === currentIndex;
        const future = i > currentIndex;

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'stretch', gap: '12px' }}>
            {/* Left column: circle + connector line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '24px',
                flexShrink: 0,
              }}
            >
              {/* Step circle */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  background: completed
                    ? '#003591'
                    : active
                    ? '#003591'
                    : 'transparent',
                  border: future
                    ? '2px solid var(--border-default)'
                    : completed
                    ? '2px solid #003591'
                    : '2px solid #003591',
                  zIndex: 1,
                }}
              >
                {completed && <Check size={12} strokeWidth={2.5} color="#fff" />}
                {active && (
                  <>
                    {/* Pulsing ring */}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '-4px',
                        borderRadius: '50%',
                        border: '2px solid #003591',
                        animation: 'timelinePulse 1.4s ease-in-out infinite',
                        opacity: 0.45,
                      }}
                    />
                    {/* Inner dot */}
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'block',
                      }}
                    />
                  </>
                )}
              </div>

              {/* Connector line (skip for last item) */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    width: '2px',
                    background: completed ? '#003591' : 'var(--border-default)',
                    minHeight: '28px',
                    marginTop: '2px',
                    marginBottom: '2px',
                    transition: 'background 200ms ease',
                  }}
                />
              )}
            </div>

            {/* Right column: label */}
            <div
              style={{
                paddingBottom: i < STEPS.length - 1 ? '24px' : '0',
                display: 'flex',
                alignItems: 'flex-start',
                paddingTop: '2px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: completed
                    ? '#4D8AFF'
                    : active
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                  transition: 'color 200ms ease',
                }}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes timelinePulse {
          0%   { transform: scale(1);   opacity: 0.45; }
          50%  { transform: scale(1.5); opacity: 0;    }
          100% { transform: scale(1);   opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
