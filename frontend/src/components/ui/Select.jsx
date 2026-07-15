import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full h-10 px-3 rounded-[var(--radius-md)] text-sm
          bg-[var(--color-surface-2)] border
          text-[var(--color-text-primary)]
          transition-colors duration-150 outline-none cursor-pointer
          ${error
            ? 'border-[var(--color-error)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
          }
          ${className}
        `}
        {...props}
      >
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value}>
            {optLabel}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
});

export default Select;
