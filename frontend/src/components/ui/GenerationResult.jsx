import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RiFileCopyLine,
  RiCheckLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiDownloadLine,
} from 'react-icons/ri';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import TypewriterText from '../ui/TypewriterText';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useDownload } from '../../hooks/useDownload';

function GenerationResult({ generation, onToggleSave, isSaving = false }) {
  const { copied, copy } = useCopyToClipboard();
  const { downloadTxt, downloadPdf } = useDownload();
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const containerRef = useRef(null);

  // Auto-scroll to result when it appears
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [generation._id]);

  const filename = generation.title || `muse-${generation.type}-${generation._id.slice(-6)}`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <Badge type={generation.type} />
            <span className="text-xs text-[var(--color-text-muted)]">
              {new Date(generation.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(generation.content)}
              title="Copy to clipboard"
            >
              {copied ? (
                <RiCheckLine className="text-[var(--color-success)]" />
              ) : (
                <RiFileCopyLine />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>

            {/* Download */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDownloadMenu((v) => !v)}
              >
                <RiDownloadLine />
                Download
              </Button>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 w-36 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] z-10 overflow-hidden"
                  onMouseLeave={() => setShowDownloadMenu(false)}
                >
                  <button
                    onClick={() => { downloadTxt(generation.content, filename); setShowDownloadMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Download .txt
                  </button>
                  <button
                    onClick={() => { downloadPdf(generation.content, filename, generation.title); setShowDownloadMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Download .pdf
                  </button>
                </motion.div>
              )}
            </div>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleSave?.(generation._id)}
              isLoading={isSaving}
              title={generation.isSaved ? 'Unsave' : 'Save'}
            >
              {generation.isSaved ? (
                <RiBookmarkFill className="text-[var(--color-accent)]" />
              ) : (
                <RiBookmarkLine />
              )}
              {generation.isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-4 px-3 py-2.5 bg-[var(--color-surface-2)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">Prompt</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{generation.prompt}</p>
        </div>

        {/* Content */}
        <TypewriterText
          text={generation.content}
          className="text-sm text-[var(--color-text-primary)] font-[var(--font-mono)]"
        />

        {/* Metadata */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-4">
          <span className="text-xs text-[var(--color-text-muted)]">
            {generation.metadata?.tokensUsed} tokens
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {(generation.metadata?.generationTimeMs / 1000).toFixed(1)}s
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {generation.metadata?.model}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

export default GenerationResult;
