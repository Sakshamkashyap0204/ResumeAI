import { useState } from 'react';
import { generationApi } from '../api/generation.api';
import toast from 'react-hot-toast';

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async (payload) => {
    setIsGenerating(true);
    setResult(null);
    try {
      const { data } = await generationApi.generate(payload);
      setResult(data.data.generation);
      return data.data.generation;
    } catch (error) {
      const message = error.response?.data?.message || 'Generation failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSave = async (id) => {
    try {
      const { data } = await generationApi.toggleSave(id);
      const updated = data.data.generation;
      setResult((prev) => (prev?._id === id ? updated : prev));
      toast.success(data.message);
      return updated;
    } catch {
      toast.error('Failed to update saved status');
    }
  };

  const reset = () => setResult(null);

  return { isGenerating, result, generate, toggleSave, reset };
}
