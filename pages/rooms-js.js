// pages/rooms.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RoomList from '../components/RoomList';
import RoomCreation from '../components/RoomCreation';
import { useGame } from '../contexts/GameContext';
import styles from '../styles/Home.module.css';

export default function Rooms() {
  const { playerName, error, setError } = useGame();

  // エラーメッセージを5秒後に消す
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ルーム一覧 | ウェブポーカー</title>
        <meta name="description" content="利用可能なポーカールーム一覧" />
      </Head>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          &larr; ホームに戻る
        </Link>
        {playerName && (
          <div className={styles.playerName}>
            プレイヤー: <strong>{playerName}</strong>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>ポーカールーム</h1>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <RoomList />
        <RoomCreation />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by GitHub Pages
        </a>
      </footer>
    </div>
  );
}
