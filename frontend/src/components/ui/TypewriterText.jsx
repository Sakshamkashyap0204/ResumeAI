import { useState, useEffect, useRef } from 'react';

const CHARS_PER_TICK = 3;
const TICK_MS = 16;

function TypewriterText({ text, onComplete, className = '' }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    indexRef.current = 0;
    setDisplayed('');

    intervalRef.current = setInterval(() => {
      indexRef.current = Math.min(indexRef.current + CHARS_PER_TICK, text.length);
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current);
        onComplete?.();
      }
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, [text, onComplete]);

  return (
    <p className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {displayed}
      {displayed.length < (text?.length || 0) && (
        <span className="inline-block w-0.5 h-4 bg-[var(--color-accent)] ml-0.5 animate-pulse" />
      )}
    </p>
  );
}

export default TypewriterText;
