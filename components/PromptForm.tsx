// File: components/PromptForm.tsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/PromptForm.module.css';

interface PromptFormProps {
  onPromptCreated: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onPromptCreated }) => {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          template,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create prompt');
      }

      setTitle('');
      setTemplate('');
      setSuccess(true);
      onPromptCreated();
    } catch (err) {
      setError('Error creating prompt. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Create New Prompt</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Spanish Translator"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="template">Template:</label>
          <textarea
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="E.g., Translate the following text into {language}: '{text_to_translate}'"
            required
            className={styles.textarea}
            rows={5}
          />
          <p className={styles.hint}>
            Use {'{variable_name}'} syntax for variables that will be filled when executing the prompt.
          </p>
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Creating...' : 'Create Prompt'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Prompt created successfully!</div>}
      </form>
    </div>
  );
};

export default PromptForm;