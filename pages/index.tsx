import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import PromptList from '../components/PromptList';
import PromptForm from '../components/PromptForm';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePromptCreated = () => {
    // Trigger a refresh of the prompt list
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Prompt Hub</title>
        <meta name="description" content="Manage and execute AI prompt templates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Prompt Hub</span>
        </h1>
        
        <p className={styles.description}>
          Create, manage, and execute AI prompt templates
        </p>

        <div className={styles.grid}>
          <div className={styles.promptsSection}>
            <PromptList key={refreshKey} />
          </div>
          
          <div className={styles.formSection}>
            <PromptForm onPromptCreated={handlePromptCreated} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Prompt Hub for Promptrun.ai</p>
      </footer>
    </div>
  );
};

export default Home;