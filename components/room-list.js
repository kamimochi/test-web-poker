// components/RoomList.js
import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const RoomList = () => {
  const { rooms, fetchRooms, joinRoom, playerName, setPlayerName } = useGame();
  const [newName, setNewName] = React.useState('');

  useEffect(() => {
    fetchRooms();
    // 10秒ごとにルーム一覧を更新
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  useEffect(() => {
    setNewName(playerName);
  }, [playerName]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      setPlayerName(newName.trim());
    }
  };

  return (
    <div className="room-list">
      {!playerName && (
        <div className="name-form-container">
          <h2>プレイヤー名を設定</h2>
          <form onSubmit={handleNameSubmit} className="name-form">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="あなたの名前"
              className="name-input"
              required
            />
            <button type="submit" className="name-submit">保存</button>
          </form>
        </div>
      )}

      <h2>利用可能なルーム</h2>
      
      {rooms.length === 0 ? (
        <p className="no-rooms">利用可能なルームはありません。新しいルームを作成してください。</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-name">{room.name}</div>
              <div className="room-info">
                <span>最大プレイヤー数: {room.max_players}</span>
                <span>ステータス: {gameStatusText(room.game_state?.status)}</span>
              </div>
              <button 
                onClick={() => joinRoom(room.id)} 
                className="join-button"
                disabled={!playerName}
              >
                参加
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .room-list {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .name-form-container {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .name-form {
          display: flex;
          gap: 10px;
        }
        .name-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        .name-submit {
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .no-rooms {
          text-align: center;
          color: #777;
          font-style: italic;
          margin: 30px 0;
        }
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .room-card {
          padding: 15px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .room-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .room-name {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .room-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 15px;
          color: #555;
          font-size: 0.9em;
        }
        .join-button {
          width: 100%;
          padding: 8px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        .join-button:hover:not(:disabled) {
          background-color: #0b7dda;
        }
        .join-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
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
    default: return status || '待機中';
  }
};

export default RoomList;
