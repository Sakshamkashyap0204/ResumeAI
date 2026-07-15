const TYPE_STYLES = {
  story: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  poem: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  joke: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

function Badge({ type, className = '' }) {
  const style = TYPE_STYLES[type] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        border capitalize ${style} ${className}
      `}
    >
      {type}
    </span>
  );
}

export default Badge;
