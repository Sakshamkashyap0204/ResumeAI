import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  RiBookOpenLine,
  RiQuillPenLine,
  RiEmotionLaughLine,
  RiSparklingLine,
} from 'react-icons/ri';
import { useGeneration } from '../../hooks/useGeneration';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import GenerationResult from '../../components/ui/GenerationResult';

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
  const { isGenerating, result, generate, toggleSave } = useGeneration();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: '',
      parameters: { length: 'medium', genre: '', tone: '' },
    },
  });

  const promptValue = watch('prompt');

  const onSubmit = async (values) => {
    const payload = {
      type: selectedType,
      prompt: values.prompt,
      parameters: {
        length: values.parameters.length,
        ...(values.parameters.genre && { genre: values.parameters.genre }),
        ...(values.parameters.tone && { tone: values.parameters.tone }),
      },
    };
    await generate(payload);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          Generate
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Describe what you want to create and let AI do the rest.
        </p>
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
              rows={4}
              maxLength={1000}
              error={errors.prompt?.message}
              {...field}
            />
          )}
        />

        {/* Parameters */}
        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="parameters.length"
            control={control}
            render={({ field }) => (
              <Select label="Length" options={LENGTH_OPTIONS} {...field} />
            )}
          />
          <Controller
            name="parameters.genre"
            control={control}
            render={({ field }) => (
              <Select label="Genre" options={GENRE_OPTIONS} {...field} />
            )}
          />
          <Controller
            name="parameters.tone"
            control={control}
            render={({ field }) => (
              <Select label="Tone" options={TONE_OPTIONS} {...field} />
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isGenerating}
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
