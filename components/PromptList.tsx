// File: components/PromptList.tsx
import React, { useEffect, useState } from 'react';
import PromptExecutor from './PromptExecutor';
import styles from '../styles/PromptList.module.css';

interface Prompt {
  id: number;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

interface PromptListProps {
  refreshKey: number;
}

const PromptList: React.FC<PromptListProps> = ({ refreshKey }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, [refreshKey]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prompts');
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      const data = await response.json();
      setPrompts(data);
      setError(null);
    } catch (err) {
      setError('Error loading prompts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading prompts...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.promptList}>
      <h2>Your Prompts</h2>
      {prompts.length === 0 ? (
        <p>No prompts yet. Create your first prompt below!</p>
      ) : (
        <div className={styles.promptGrid}>
          {prompts.map((prompt) => (
            <div key={prompt.id} className={styles.promptCard}>
              <h3>{prompt.title}</h3>
              <p className={styles.templatePreview}>{prompt.template.substring(0, 100)}...</p>
              <PromptExecutor prompt={prompt} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptList;