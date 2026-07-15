import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDeleteBinLine,
  RiBookmarkLine,
  RiBookmarkFill,
  RiFileCopyLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiHistoryLine,
} from 'react-icons/ri';
import { generationApi } from '../../api/generation.api';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import toast from 'react-hot-toast';

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'story', label: 'Stories' },
  { value: 'poem', label: 'Poems' },
  { value: 'joke', label: 'Jokes' },
];

function HistoryItem({ item, onDelete, onToggleSave }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-cancel confirm after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete(item._id);
  };

  return (
    <Card className="overflow-hidden">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge type={item.type} />
            <span className="text-xs text-[var(--color-text-muted)]">
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] truncate">
            Prompt: {item.prompt}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => copy(item.content)}
            title="Copy content"
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            {copied ? (
              <RiCheckLine className="text-[var(--color-success)]" />
            ) : (
              <RiFileCopyLine />
            )}
          </button>

          <button
            onClick={() => onToggleSave(item._id)}
            title={item.isSaved ? 'Unsave' : 'Save'}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-colors"
          >
            {item.isSaved ? (
              <RiBookmarkFill className="text-[var(--color-accent)]" />
            ) : (
              <RiBookmarkLine />
            )}
          </button>

          <button
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
            className={`p-1.5 rounded-[var(--radius-sm)] transition-colors text-sm font-medium
              ${confirmDelete
                ? 'bg-[var(--color-error)] text-white px-2'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
              }`}
          >
            {confirmDelete ? 'Confirm?' : <RiDeleteBinLine />}
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div className="px-4 pb-3">
        <p className={`text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap ${!expanded ? 'line-clamp-3' : ''}`}>
          {item.content}
        </p>
      </div>

      {/* Expand / Collapse toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border-t border-[var(--color-border-subtle)] transition-colors"
      >
        {expanded ? (
          <><RiArrowUpSLine /> Show less</>
        ) : (
          <><RiArrowDownSLine /> Show full content</>
        )}
      </button>
    </Card>
  );
}

function HistoryPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await generationApi.getHistory({
        page,
        ...(typeFilter && { type: typeFilter }),
      });
      setItems(data.data.items);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    try {
      await generationApi.delete(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success('Deleted');
      // If page is now empty and not first page, go back
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleSave = async (id) => {
    try {
      const { data } = await generationApi.toggleSave(id);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? data.data.generation : item))
      );
      toast.success(data.message);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          History
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          All your generated content — stored permanently, survives logout
        </p>
      </div>

      {/* Filters */}
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

        {pagination && (
          <span className="ml-auto text-xs text-[var(--color-text-muted)]">
            {pagination.total} total
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <RiHistoryLine className="text-4xl text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">No generations yet</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Go to Generate to create your first story, poem, or joke
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
                <HistoryItem
                  item={item}
                  onDelete={handleDelete}
                  onToggleSave={handleToggleSave}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs text-[var(--color-text-muted)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
