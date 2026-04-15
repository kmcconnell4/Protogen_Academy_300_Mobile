'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import type { Job } from '@/lib/mock/types';

interface JobMessagesProps {
  job: Job;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  timestamp: string;
  isMine: boolean;
}

// Mock messages seeded to the job
const MOCK_MESSAGES: Message[] = [
  {
    id: 'm-001',
    senderId: 'user-rep-1',
    senderName: 'Derek Fontaine',
    body: 'Phase 1 inspection passed. Ready to proceed with Phase 2 membrane install.',
    timestamp: '2026-04-01T09:15:00Z',
    isMine: false,
  },
  {
    id: 'm-002',
    senderId: 'user-contractor-1',
    senderName: 'Marcus Webb',
    body: "Good to hear. We'll mobilize the north section crew on Monday the 20th.",
    timestamp: '2026-04-01T10:02:00Z',
    isMine: true,
  },
  {
    id: 'm-003',
    senderId: 'user-rep-1',
    senderName: 'Derek Fontaine',
    body: "Confirmed. I'll arrange for the CAV-GRIP\u00ae drums to be staged at the loading dock the Friday before.",
    timestamp: '2026-04-01T10:45:00Z',
    isMine: false,
  },
  {
    id: 'm-004',
    senderId: 'user-contractor-1',
    senderName: 'Marcus Webb',
    body: 'Perfect. Do you have a contact at XPO for the Saturday drop?',
    timestamp: '2026-04-02T08:30:00Z',
    isMine: true,
  },
  {
    id: 'm-005',
    senderId: 'user-rep-1',
    senderName: 'Derek Fontaine',
    body: 'Yes \u2014 @Sandra can coordinate that, she handled the Greenfield delivery.',
    timestamp: '2026-04-02T09:00:00Z',
    isMine: false,
  },
];

const MENTION_SUGGESTIONS = ['Marcus Webb', 'Derek Fontaine', 'Sandra Kowalski', 'Priya Nair'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function JobMessages({ job: _job }: JobMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Detect @mention trigger
    const match = val.match(/@(\w*)$/);
    setMentionQuery(match ? match[1].toLowerCase() : null);
  };

  const applySuggestion = (name: string) => {
    const replaced = inputValue.replace(/@\w*$/, `@${name} `);
    setInputValue(replaced);
    setMentionQuery(null);
  };

  const sendMessage = () => {
    const body = inputValue.trim();
    if (!body) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        senderId: 'current-user',
        senderName: 'You',
        body,
        timestamp: new Date().toISOString(),
        isMine: true,
      },
    ]);
    setInputValue('');
    setMentionQuery(null);
  };

  const filteredSuggestions = mentionQuery !== null
    ? MENTION_SUGGESTIONS.filter(s => s.toLowerCase().includes(mentionQuery))
    : [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: '400px',
        position: 'relative',
      }}
    >
      {/* Scrollable message list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '12px',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.isMine ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            {/* Avatar */}
            {!msg.isMine && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#003591',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {getInitials(msg.senderName)}
              </div>
            )}

            {/* Bubble group */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                maxWidth: '75%',
                alignItems: msg.isMine ? 'flex-end' : 'flex-start',
              }}
            >
              {!msg.isMine && (
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  {msg.senderName}
                </span>
              )}
              <div
                style={{
                  background: msg.isMine ? '#003591' : 'var(--bg-surface-2)',
                  color: msg.isMine ? '#fff' : 'var(--text-primary)',
                  borderRadius: msg.isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                {msg.body}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* @mention suggestions */}
      {filteredSuggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '68px',
            left: 0,
            right: 0,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {filteredSuggestions.map(name => (
            <button
              key={name}
              onMouseDown={e => { e.preventDefault(); applySuggestion(name); }}
              style={{
                all: 'unset',
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
                boxSizing: 'border-box',
              }}
            >
              @{name}
            </button>
          ))}
        </div>
      )}

      {/* Sticky input bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-base)',
        }}
      >
        <button
          aria-label="Attach file"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <Paperclip size={16} strokeWidth={1.8} color="var(--text-secondary)" />
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Message…"
          style={{
            flex: 1,
            height: '40px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '0 14px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 120ms ease',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#003591')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        />

        <button
          onClick={sendMessage}
          aria-label="Send message"
          disabled={!inputValue.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: inputValue.trim() ? '#003591' : 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: inputValue.trim() ? 'pointer' : 'default',
            transition: 'background 120ms ease',
          }}
        >
          <Send
            size={16}
            strokeWidth={1.8}
            color={inputValue.trim() ? '#fff' : 'var(--text-muted)'}
          />
        </button>
      </div>
    </div>
  );
}
