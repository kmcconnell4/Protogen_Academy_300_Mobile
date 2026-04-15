'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Search, Mic, MicOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

// Web Speech API — not fully typed in lib.dom.d.ts across all browsers
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: { isFinal: boolean; [index: number]: { transcript: string } };
  };
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface GlobalSearchBarProps {
  onSearch?: (query: string) => void;
  showVoice?: boolean;
}

const localeToLang: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
};

export default function GlobalSearchBar({ onSearch, showVoice = true }: GlobalSearchBarProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const [value, setValue] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const startVoice = useCallback(() => {
    if (typeof window === 'undefined') return;
    const win = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognitionAPI = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.lang = localeToLang[locale] ?? 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(interim || final);
      if (final) {
        setValue(final);
        onSearch?.(final);
      }
    };

    recognition.onend = () => {
      setRecording(false);
      setTranscript('');
    };

    recognition.onerror = () => {
      setRecording(false);
      setTranscript('');
    };

    recognition.start();
  }, [locale, onSearch]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
    setTranscript('');
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface-2)',
          borderRadius: '10px',
          height: '48px',
          padding: '0 12px',
          gap: '10px',
          border: '1px solid var(--border-subtle)',
          transition: 'border-color 120ms ease',
        }}
        onFocusCapture={e => (e.currentTarget.style.borderColor = '#003591')}
        onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
      >
        <Search size={18} strokeWidth={1.8} color="var(--text-muted)" />
        <input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={t('placeholder')}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
          }}
        />
        {showVoice && (
          <button
            onClick={recording ? stopVoice : startVoice}
            aria-label="Start voice search"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: recording ? '#003591' : 'var(--bg-surface-3)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              transition: 'background 120ms ease',
            }}
          >
            {recording && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid #003591',
                  animation: 'micPulse 1s ease-in-out infinite',
                }}
              />
            )}
            {recording
              ? <MicOff size={16} strokeWidth={1.8} color="#fff" />
              : <Mic size={16} strokeWidth={1.8} color="var(--text-secondary)" />
            }
          </button>
        )}
      </div>

      {transcript && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            margin: 0,
            padding: '0 4px',
          }}
        >
          {transcript}
        </p>
      )}

      <style>{`
        @keyframes micPulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
