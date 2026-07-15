function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-[var(--color-surface-1)] border border-[var(--color-border)]
        rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
