// pages/room/[id].js
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import GameTable from '../../components/GameTable';
import { useGame } from '../../contexts/GameContext';
import styles from '../../styles/Home.module.css';

export default function Room() {
  const router = useRouter();
  const { id } = router.query;
  const { fetchRoomData, currentRoom, error, setError, playerName } = useGame();

  useEffect(() => {
    if (id && playerName) {
      fetchRoomData(id);
    } else if (id && !playerName) {
      router.push('/rooms');
    }
  }, [id, playerName, fetchRoomData, router]);

  // エラーメッセージを5秒後に消す
  useEffect(() => {
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
        <title>{currentRoom?.name || 'ポーカールーム'} | ウェブポーカー</title>
        <meta name="description" content="ポーカーゲーム" />
      </Head>

      <header className={styles.header}>
        <Link href="/rooms" className={styles.backLink}>
          &larr; ルーム一覧に戻る
        </Link>
        {playerName && (
          <div className={styles.playerName}>
            プレイヤー: <strong>{playerName}</strong>
          </div>
        )}
      </header>

      <main className={styles.roomMain}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {currentRoom ? (
          <GameTable />
        ) : (
          <div className={styles.loading}>
            ルーム情報を読み込み中...
          </div>
        )}
      </main>
    </div>
  );
}
