import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBookmarkFill, RiDownloadLine, RiFileCopyLine } from 'react-icons/ri';
import { generationApi } from '../../api/generation.api';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useDownload } from '../../hooks/useDownload';
import toast from 'react-hot-toast';

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'story', label: 'Stories' },
  { value: 'poem', label: 'Poems' },
  { value: 'joke', label: 'Jokes' },
];

function SavedItemCard({ item, onUnsave }) {
  const { copied, copy } = useCopyToClipboard();
  const { downloadTxt } = useDownload();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge type={item.type} />
          {item.title && (
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {item.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => copy(item.content)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
            title="Copy"
          >
            <RiFileCopyLine className={copied ? 'text-[var(--color-success)]' : ''} />
          </button>
          <button
            onClick={() => downloadTxt(item.content, item.title || `muse-${item.type}`)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
            title="Download"
          >
            <RiDownloadLine />
          </button>
          <button
            onClick={() => onUnsave(item._id)}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-colors"
            title="Unsave"
          >
            <RiBookmarkFill />
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mb-2">{item.prompt}</p>
      <p className="text-sm text-[var(--color-text-primary)] line-clamp-3 leading-relaxed whitespace-pre-wrap">
        {item.content}
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-3">
        {new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        })}
      </p>
    </Card>
  );
}

function SavedPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchSaved = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await generationApi.getSaved({
        page,
        ...(typeFilter && { type: typeFilter }),
      });
      setItems(data.data.items);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load saved content');
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleUnsave = async (id) => {
    try {
      await generationApi.toggleSave(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success('Removed from saved');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          Saved
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your bookmarked content
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        {TYPE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setTypeFilter(value); setPage(1); }}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150
              ${typeFilter === value
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <RiBookmarkFill className="text-3xl text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)] text-sm">Nothing saved yet</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Bookmark generations to find them here
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <SavedItemCard item={item} onUnsave={handleUnsave} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-xs text-[var(--color-text-muted)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default SavedPage;
