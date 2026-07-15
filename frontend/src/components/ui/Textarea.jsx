import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, maxLength, value = '', className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
          {maxLength && (
            <span className={`text-xs tabular-nums ${
              value.length > maxLength * 0.9
                ? 'text-[var(--color-warning)]'
                : 'text-[var(--color-text-muted)]'
            }`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm resize-none
          bg-[var(--color-surface-2)] border
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-muted)]
          transition-colors duration-150 outline-none
          ${error
            ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
});

export default Textarea;
