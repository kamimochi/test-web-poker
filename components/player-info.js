// components/PlayerInfo.js
import React from 'react';
import Hand from './Hand';

const PlayerInfo = ({ player, isCurrentPlayer, isTurn, showCards = false }) => {
  return (
    <div className={`player-info ${isCurrentPlayer ? 'current-player' : ''} ${isTurn ? 'active-turn' : ''}`}>
      <div className="player-name">
        {player.name} 
        {isCurrentPlayer && <span className="you-label">(あなた)</span>}
        {isTurn && <span className="turn-label">ターン中</span>}
      </div>
      <div className="player-chips">チップ: {player.chips}</div>
      {player.hand && player.hand.length > 0 && (
        <Hand 
          cards={player.hand} 
          hidden={!isCurrentPlayer && !showCards} 
        />
      )}
      <style jsx>{`
        .player-info {
          padding: 10px;
          margin: 10px;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .current-player {
          border: 2px solid #4caf50;
        }
        .active-turn {
          background-color: rgba(255, 248, 220, 0.9);
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
        }
        .player-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .you-label {
          color: #4caf50;
          margin-left: 5px;
        }
        .turn-label {
          margin-left: 10px;
          padding: 2px 6px;
          background-color: #ffc107;
          border-radius: 3px;
          font-size: 0.8em;
        }
        .player-chips {
          color: #555;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default PlayerInfo;
