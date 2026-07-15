import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    } catch {
      // Clipboard access denied — silently fail
    }
  }, [resetDelay]);

  return { copied, copy };
}
