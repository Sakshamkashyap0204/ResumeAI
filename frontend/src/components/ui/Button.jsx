import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-sm',
  secondary: 'bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
  ghost: 'hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  danger: 'bg-[var(--color-error)]/10 hover:bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/20',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-sm gap-2',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    children,
    className = '',
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]
        transition-colors duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size={size === 'sm' ? 12 : 14} />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
});

function Spinner({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default Button;
