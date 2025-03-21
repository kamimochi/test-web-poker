// components/GameTable.js
import React from 'react';
import PlayerInfo from './PlayerInfo';
import Hand from './Hand';
import { useGame } from '../contexts/GameContext';

const GameTable = () => {
  const { 
    playerId,
    players,
    gameState,
    playerHand,
    chips,
    performAction,
    startGame,
    resetGame,
    leaveRoom,
    currentRoom
  } = useGame();

  const [betAmount, setBetAmount] = React.useState(10);

  const isGameActive = gameState.status !== 'waiting';
  const isShowdown = gameState.status === 'showdown';
  const currentPlayerIndex = gameState.currentPlayerIndex || 0;
  const isCurrentPlayerTurn = players[currentPlayerIndex]?.id === playerId;

  const handleBetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= chips) {
      setBetAmount(value);
    }
  };

  return (
    <div className="game-table">
      <div className="table-header">
        <h2>{currentRoom?.name || 'ポーカールーム'}</h2>
        <div className="game-status">ステータス: {gameStatusText(gameState.status)}</div>
        {gameState.pot > 0 && (
          <div className="pot">ポット: {gameState.pot}</div>
        )}
      </div>

      {isGameActive && gameState.communityCards && gameState.communityCards.length > 0 && (
        <div className="community-cards">
          <h3>コミュニティカード</h3>
          <Hand 
            cards={isShowdown ? gameState.communityCards : gameState.communityCards.slice(0, 3)} 
          />
        </div>
      )}

      <div className="players-container">
        {players.map((player, index) => (
          <PlayerInfo 
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === playerId}
            isTurn={isGameActive && index === currentPlayerIndex}
            showCards={isShowdown}
          />
        ))}
      </div>

      {playerId && (
        <div className="player-actions">
          {!isGameActive && players.length >= 2 && (
            <button onClick={startGame} className="action-button start">ゲーム開始</button>
          )}
          
          {isGameActive && isCurrentPlayerTurn && !isShowdown && (
            <div className="betting-actions">
              <button onClick={() => performAction('check')} className="action-button check">チェック</button>
              <div className="bet-container">
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={handleBetChange} 
                  min="1" 
                  max={chips} 
                  className="bet-input"
                />
                <button onClick={() => performAction('bet', betAmount)} className="action-button bet">ベット</button>
              </div>
              <button onClick={() => performAction('fold')} className="action-button fold">フォールド</button>
            </div>
          )}
          
          {isShowdown && (
            <button onClick={resetGame} className="action-button reset">新しいゲーム</button>
          )}
          
          <button onClick={leaveRoom} className="action-button leave">ルームを退出</button>
        </div>
      )}

      {gameState.winner && (
        <div className="winner-announcement">
          <h3>勝者: {gameState.winner.name}</h3>
        </div>
      )}

      <style jsx>{`
        .game-table {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background-color: #1b5e20;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          color: white;
        }
        .table-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .game-status {
          margin: 10px 0;
          font-size: 1.1em;
        }
        .pot {
          font-size: 1.2em;
          font-weight: bold;
          color: #ffc107;
        }
        .community-cards {
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
        .players-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin: 20px 0;
        }
        .player-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        .betting-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }
        .bet-container {
          display: flex;
        }
        .bet-input {
          width: 80px;
          padding: 8px;
          border: none;
          border-radius: 4px 0 0 4px;
        }
        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin: 5px;
          transition: all 0.2s;
        }
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .start {
          background-color: #4caf50;
          color: white;
        }
        .check {
          background-color: #2196f3;
          color: white;
        }
        .bet {
          background-color: #ff9800;
          color: white;
          border-radius: 0 4px 4px 0;
        }
        .fold {
          background-color: #f44336;
          color: white;
        }
        .reset {
          background-color: #9c27b0;
          color: white;
        }
        .leave {
          background-color: #607d8b;
          color: white;
        }
        .winner-announcement {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
          background-color: rgba(255, 215, 0, 0.2);
          border-radius: 5px;
          color: #ffc107;
        }
      `}</style>
    </div>
  );
};

// ゲーム状態を日本語に変換
const gameStatusText = (status) => {
  switch (status) {
    case 'waiting': return '待機中';
    case 'dealing': return 'ディール中';
    case 'betting': return 'ベッティング';
    case 'showdown': return 'ショーダウン';
    default: return status;
  }
};

export default GameTable;
