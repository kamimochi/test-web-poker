// lib/poker.js
const SUITS = ['Club', 'Diamond', 'Heart', 'Spade'];
const RANKS = Array.from({ length: 13 }, (_, i) => i + 1);

// カードデッキを生成
export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

// デッキをシャッフル
export const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// カードを配る
export const dealCards = (deck, numPlayers, cardsPerPlayer = 2) => {
  const hands = Array(numPlayers).fill().map(() => []);
  const newDeck = [...deck];
  
  // 各プレイヤーに順番にカードを配る
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (newDeck.length > 0) {
        hands[j].push(newDeck.pop());
      }
    }
  }
  
  // コミュニティカードを5枚用意
  const communityCards = [];
  for (let i = 0; i < 5; i++) {
    if (newDeck.length > 0) {
      communityCards.push(newDeck.pop());
    }
  }
  
  return { hands, deck: newDeck, communityCards };
};

// 役を評価する関数（簡易版）
export const evaluateHand = (playerCards, communityCards) => {
  const allCards = [...playerCards, ...communityCards];
  
  // ここで役の評価ロジックを実装
  // 実際のポーカーでは複雑な役の評価が必要です
  
  // 簡易版の実装（ペアの数だけをチェック）
  const rankCounts = {};
  allCards.forEach(card => {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  });
  
  const pairs = Object.values(rankCounts).filter(count => count >= 2).length;
  
  if (pairs >= 1) {
    return { rank: 1, name: "ワンペア" };
  }
  
  return { rank: 0, name: "ハイカード" };
};

// ゲームの勝者を決定する
export const determineWinner = (players, communityCards) => {
  const results = players.map(player => {
    const evaluation = evaluateHand(player.hand, communityCards);
    return {
      ...player,
      evaluation
    };
  });
  
  // 最高の役を持つプレイヤーを見つける
  results.sort((a, b) => b.evaluation.rank - a.evaluation.rank);
  const winners = results.filter(player => player.evaluation.rank === results[0].evaluation.rank);
  
  return {
    winners,
    allResults: results
  };
};
