// pages/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ウェブポーカー</title>
        <meta name="description" content="GitHub Pages でホストされたオンラインポーカーゲーム" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          ウェブポーカーへようこそ
        </h1>

        <p className={styles.description}>
          友達とオンラインでポーカーを楽しもう！
        </p>

        <div className={styles.grid}>
          <Link href="/rooms" className={styles.card}>
            <h2>ルーム一覧 &rarr;</h2>
            <p>利用可能なルームを見る、または新しいルームを作成する</p>
          </Link>
        </div>
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
