import React, { useState } from 'react';
import styles from '../styles/PromptExecutor.module.css';

interface Prompt {
  id: number;
  title: string;
  template: string;
}

interface PromptExecutorProps {
  prompt: Prompt;
}

const PromptExecutor: React.FC<PromptExecutorProps> = ({ prompt }) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract variable names from the template
  const extractVariables = (template: string): string[] => {
    const regex = /{([^{}]+)}/g;
    const matches = template.match(regex) || [];
    return matches.map(match => match.slice(1, -1));
  };

  const variableNames = extractVariables(prompt.template);

  const handleInputChange = (name: string, value: string) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const executePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prompts/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: prompt.id,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute prompt');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('Error executing prompt. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.executor}>
      <h4>Execute Prompt</h4>
      <form onSubmit={executePrompt}>
        {variableNames.map(name => (
          <div key={name} className={styles.variableInput}>
            <label htmlFor={`${prompt.id}-${name}`}>{name}:</label>
            <input
              id={`${prompt.id}-${name}`}
              type="text"
              value={variables[name] || ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className={styles.executeButton}>
          {loading ? 'Executing...' : 'Execute'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}
      
      {result && (
        <div className={styles.result}>
          <h4>Result:</h4>
          <div className={styles.resultContent}>{result}</div>
        </div>
      )}
    </div>
  );
};

export default PromptExecutor;