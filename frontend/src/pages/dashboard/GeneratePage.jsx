import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  RiBookOpenLine,
  RiQuillPenLine,
  RiEmotionLaughLine,
  RiSparklingLine,
  RiAddLine,
  RiCloseLine,
  RiFileTextLine,
  RiImageLine,
  RiRulerLine,
  RiPriceTag3Line,
  RiPaletteLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useGeneration } from '../../hooks/useGeneration';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import GenerationResult from '../../components/ui/GenerationResult';
import { attachmentApi } from '../../api/attachment.api';
import { useWorkspace } from '../../store/WorkspaceContext';

const generateSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters').max(1000),
  parameters: z.object({
    length: z.enum(['short', 'medium', 'long']).default('medium'),
    genre: z.string().optional(),
    tone: z.string().optional(),
  }),
});

const CONTENT_TYPES = [
  { id: 'story', label: 'Story', icon: RiBookOpenLine, description: 'Narrative fiction' },
  { id: 'poem', label: 'Poem', icon: RiQuillPenLine, description: 'Verse & poetry' },
  { id: 'joke', label: 'Joke', icon: RiEmotionLaughLine, description: 'Comedy & humor' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

const GENRE_OPTIONS = [
  { value: '', label: 'Any genre' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'horror', label: 'Horror' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
];

const TONE_OPTIONS = [
  { value: '', label: 'Any tone' },
  { value: 'serious', label: 'Serious' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'melancholic', label: 'Melancholic' },
  { value: 'uplifting', label: 'Uplifting' },
  { value: 'dark', label: 'Dark' },
  { value: 'whimsical', label: 'Whimsical' },
];

function GeneratePage() {
  const [selectedType, setSelectedType] = useState('story');
  const [attachments, setAttachments] = useState([]);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [attachmentAccept, setAttachmentAccept] = useState('.pdf,.txt,.docx,.png,.jpg,.jpeg,.webp');
  const fileInputRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const { generationContext, clearGenerationContext } = useWorkspace();
  const { isGenerating, result, generate, toggleSave, reset } = useGeneration();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: '',
      parameters: { length: 'medium', genre: '', tone: '' },
    },
  });

  const promptValue = watch('prompt');

  useEffect(() => {
    if (!isAttachmentMenuOpen) return undefined;

    const closeMenu = (event) => {
      if (!attachmentMenuRef.current?.contains(event.target)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsAttachmentMenuOpen(false);
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAttachmentMenuOpen]);

  const handleNewGeneration = () => {
    reset();
    resetForm({ prompt: '', parameters: { length: 'medium', genre: '', tone: '' } });
    setAttachments((current) => {
      current.forEach((attachment) => attachment.preview && URL.revokeObjectURL(attachment.preview));
      return [];
    });
    clearGenerationContext();
  };

  const onSubmit = async (values) => {
    const payload = {
      type: selectedType,
      prompt: values.prompt,
      parameters: {
        length: values.parameters.length,
        ...(values.parameters.genre && { genre: values.parameters.genre }),
        ...(values.parameters.tone && { tone: values.parameters.tone }),
      },
      attachmentIds: attachments.map(({ id }) => id),
      conversationId: generationContext?.id,
    };
    await generate(payload);
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (attachments.length + files.length > 2) {
      toast.error('You can attach up to 2 files');
      return;
    }

    for (const file of files) {
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      const item = { key: `${file.name}-${file.lastModified}`, name: file.name, type: file.type, preview, status: 'uploading' };
      setAttachments((current) => [...current, item]);
      try {
        const { data } = await attachmentApi.upload(file);
        setAttachments((current) => current.map((attachment) => attachment.key === item.key
          ? { ...attachment, id: data.data.attachment._id, status: 'ready' }
          : attachment));
      } catch (error) {
        setAttachments((current) => current.filter((attachment) => attachment.key !== item.key));
        if (preview) URL.revokeObjectURL(preview);
        toast.error(error.response?.data?.message || `Unable to process ${file.name}`);
      }
    }
  };

  const openAttachmentPicker = (accept) => {
    setAttachmentAccept(accept);
    setIsAttachmentMenuOpen(false);
    fileInputRef.current?.click();
  };

  const removeAttachment = (key) => {
    setAttachments((current) => {
      const attachment = current.find((item) => item.key === key);
      if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
      return current.filter((item) => item.key !== key);
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Generate</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Describe what you want to create and let AI do the rest.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={handleNewGeneration}>+ New Generation</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Type Selector */}
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            Content type
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CONTENT_TYPES.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedType(id)}
                className={`
                  flex flex-col items-start gap-1.5 p-3.5 rounded-[var(--radius-lg)]
                  border transition-all duration-150 text-left
                  ${selectedType === id
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-1)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
                  }
                `}
              >
                <Icon className={`text-lg ${selectedType === id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                <div>
                  <p className={`text-sm font-medium ${selectedType === id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div ref={attachmentMenuRef} className="relative">
          <Controller
            name="prompt"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Your prompt"
                placeholder={
                  selectedType === 'story'
                    ? 'A detective who can only solve crimes by dreaming about them...'
                    : selectedType === 'poem'
                    ? 'The feeling of watching rain from a coffee shop window...'
                    : 'Why programmers prefer dark mode...'
                }
                rows={1}
                maxLength={1000}
                error={errors.prompt?.message}
                className="pb-12"
                {...field}
              />
            )}
          />
          <div className="absolute bottom-3 left-3">
            <button
              type="button"
              onClick={() => setIsAttachmentMenuOpen((open) => !open)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-base transition-colors ${isAttachmentMenuOpen ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'}`}
              aria-label="Add attachment"
              aria-expanded={isAttachmentMenuOpen}
              title="Add attachment"
            >
              <RiAddLine />
            </button>
            <AnimatePresence>
              {isAttachmentMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute bottom-10 left-0 z-10 w-44 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-1 shadow-[var(--shadow-elevated)]"
                >
                  <button type="button" onClick={() => openAttachmentPicker('.pdf,.txt,.docx')} className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]">
                    <RiFileTextLine className="text-base text-[var(--color-accent)]" /> Document
                  </button>
                  <button type="button" onClick={() => openAttachmentPicker('.png,.jpg,.jpeg,.webp')} className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]">
                    <RiImageLine className="text-base text-[var(--color-accent)]" /> Image
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <input ref={fileInputRef} type="file" multiple accept={attachmentAccept} onChange={handleFiles} className="hidden" />
          </div>
          {attachments.length > 0 && (
            <div className="absolute bottom-3 left-14 right-3 flex gap-2 overflow-hidden">
              {attachments.map((attachment) => (
                <div key={attachment.key} className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-2 py-1 text-xs text-[var(--color-text-secondary)]">
                  {attachment.preview ? <img src={attachment.preview} alt="" className="h-6 w-6 rounded object-cover" /> : <RiFileTextLine className="shrink-0 text-base text-[var(--color-accent)]" />}
                  <span className="max-w-32 truncate">{attachment.name}</span>
                  <span className="shrink-0 text-[var(--color-text-muted)]">{attachment.status === 'uploading' ? 'Processing...' : 'Ready'}</span>
                  <button type="button" onClick={() => removeAttachment(attachment.key)} className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-error)]" aria-label={`Remove ${attachment.name}`} title="Remove attachment">
                    <RiCloseLine />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {generationContext && (
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] px-3 py-2 text-sm">
            <span className="text-[var(--color-accent)]">Chat context added: {generationContext.title}</span>
            <button type="button" onClick={clearGenerationContext} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Clear</button>
          </div>
        )}

        {/* Parameters */}
        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="parameters.length"
            control={control}
            render={({ field }) => (
              <Select label="Length" icon={RiRulerLine} options={LENGTH_OPTIONS} {...field} />
            )}
          />
          <Controller
            name="parameters.genre"
            control={control}
            render={({ field }) => (
              <Select label="Genre" icon={RiPriceTag3Line} options={GENRE_OPTIONS} {...field} />
            )}
          />
          <Controller
            name="parameters.tone"
            control={control}
            render={({ field }) => (
              <Select label="Tone" icon={RiPaletteLine} options={TONE_OPTIONS} {...field} />
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isGenerating}
          disabled={attachments.some(({ status }) => status !== 'ready')}
          className="w-full"
        >
          <RiSparklingLine className="text-base" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <div className="mt-8">
            <GenerationResult
              generation={result}
              onToggleSave={toggleSave}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GeneratePage;
