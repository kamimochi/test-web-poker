// pages/_app.js
import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  );
}

export default MyApp;
