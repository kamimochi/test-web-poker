// components/RoomCreation.js
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

const RoomCreation = () => {
  const { createRoom, playerName } = useGame();
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      createRoom(roomName, maxPlayers);
    }
  };

  return (
    <div className="room-creation">
      <h2>新しいルームを作成</h2>
      <form onSubmit={handleSubmit} className="creation-form">
        <div className="form-group">
          <label htmlFor="roomName">ルーム名:</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="ルーム名を入力"
            className="room-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="maxPlayers">最大プレイヤー数:</label>
          <select
            id="maxPlayers"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            className="player-select"
          >
            {[2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="create-button"
          disabled={!playerName || !roomName.trim()}
        >
          ルームを作成
        </button>
      </form>
      
      <style jsx>{`
        .room-creation {
          max-width: 500px;
          margin: 30px auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .creation-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        label {
          font-weight: bold;
          color: #555;
        }
        .room-input, .player-select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        .create-button {
          padding: 12px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
          transition: background-color 0.2s;
        }
        .create-button:hover:not(:disabled) {
          background-color: #45a049;
        }
        .create-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default RoomCreation;
