import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-7xl font-bold text-[var(--color-surface-3)] mb-4 select-none">
          404
        </p>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
