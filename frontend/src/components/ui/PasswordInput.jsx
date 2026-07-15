import { forwardRef, useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, className = '', ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={`
            w-full h-10 pl-3 pr-10 rounded-[var(--radius-md)] text-sm
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
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          tabIndex={-1}
        >
          {visible ? <RiEyeOffLine className="text-base" /> : <RiEyeLine className="text-base" />}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
});

export default PasswordInput;
