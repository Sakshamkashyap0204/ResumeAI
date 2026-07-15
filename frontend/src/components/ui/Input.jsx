import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full h-10 px-3 rounded-[var(--radius-md)] text-sm
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
      {hint && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  );
});

export default Input;
