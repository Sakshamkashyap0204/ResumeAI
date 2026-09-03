import { forwardRef, useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';

const Select = forwardRef(function Select(
  { label, icon: Icon, error, options = [], className = '', ...props },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find(({ value }) => value === props.value) || options[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeMenu = (event) => {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [isOpen]);

  const selectOption = (value) => {
    props.onChange?.({ target: { name: props.name, value } });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[var(--color-accent)]" />}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false);
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIsOpen((open) => !open); }
          }}
          className={`
            w-full h-11 flex items-center text-left px-3 ${Icon ? 'pl-9' : ''} pr-9 rounded-[var(--radius-md)] text-sm
            bg-[var(--color-surface-2)] border text-[var(--color-text-primary)]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-150 outline-none cursor-pointer
            hover:bg-[var(--color-surface-3)] hover:border-[var(--color-accent)]/50
            focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15
            ${isOpen ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/15' : ''}
            ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'} ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate">{selectedOption?.label}</span>
          <RiArrowDownSLine className={`pointer-events-none absolute right-3 text-base text-[var(--color-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--color-accent)]' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 right-0 z-30 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-accent)]/40 bg-[var(--color-surface-1)] p-1 shadow-[var(--shadow-elevated)]"
              role="listbox"
            >
              {options.map(({ value, label: optLabel }) => (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={props.value === value}
                  onClick={() => selectOption(value)}
                  className={`flex w-full items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm transition-colors ${props.value === value ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'}`}
                >
                  {optLabel}
                  {props.value === value && <span className="text-xs">Selected</span>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <select ref={ref} {...props} tabIndex={-1} aria-hidden="true" className="sr-only" />
      </div>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
});

export default Select;
