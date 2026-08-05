export default function SkillBadge({ skill, variant = 'default' }) {
  const styles = {
    default: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${styles[variant]}`}>
      {skill}
    </span>
  );
}
