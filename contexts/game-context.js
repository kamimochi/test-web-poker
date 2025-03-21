// contexts/GameContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import { connectWebSocket, sendMessage, addMessageHandler, closeWebSocket } from '../lib/websocket';
import { createDeck, shuffleDeck, dealCards, determineWinner } from '../lib/poker';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const router = useRouter();
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState({
    status: 'waiting', // waiting, dealing, betting, showdown
    deck: [],
    communityCards: [],
    pot: 0,
    currentPlayerIndex: 0,
    winner: null
  });
  const [playerHand, setPlayerHand] = useState([]);
  const [chips, setChips] = useState(1000);
  const [error, setError] = useState(null);

  // ăăŹă¤ă¤ăźIDăŽĺćĺ
  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    const storedPlayerName = localStorage.getItem('playerName');
    
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      const newPlayerId = uuidv4();
      localStorage.setItem('playerId', newPlayerId);
      setPlayerId(newPlayerId);
    }
    
    if (storedPlayerName) {
      setPlayerName(storedPlayerName);
    }
  }, []);

  // ăŤăźă ä¸čŚ§ăŽĺĺž
  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');
      
      if (error) throw error;
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.message);
    }
  };

  // ăŤăźă ăŽä˝ć
  const createRoom = async (roomName, maxPlayers = 6) => {
    try {
      if (!playerName) {
        throw new Error('ăăŹă¤ă¤ăźĺăč¨­ĺŽăăŚăă ăă');
      }

      const roomId = uuidv4();
      const initialGameState = {
        status: 'waiting',
        deck: createDeck(),
        communityCards: [],
        pot: 0,
        currentPlayerIndex: 0
      };

      // ăŤăźă ăăăźăżăăźăšăŤä˝ć
      const { error: roomError } = await supabase
        .from('rooms')
        .insert([{
          id: roomId,
          name: roomName,
          max_players: maxPlayers,
          game_state: initialGameState
        }]);
      
      if (roomError) throw roomError;

      // ăăŹă¤ă¤ăźăăăźăżăăźăšăŤçťé˛
      const { error: playerError } = await supabase
        .from('players')
        .insert([{
          id: playerId,
          room_id: roomId,
          name: playerName,
          chips: 1000,
          hand: [],
          is_active: true
        }]);
      
      if (playerError) throw playerError;

      // ăŤăźă ä¸čŚ§ăć´ć°
      await fetchRooms();
      
      // ä˝ćăăăŤăźă ă¸ç§ťĺ
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error.message);
    }
  };

  // ăŤăźă ăŤĺĺ 
  const joinRoom = async (roomId) => {
    try {
      if (!playerName) {
        throw new Error('ăăŹă¤ă¤ăźĺăč¨­ĺŽăăŚăă ăă');
      }

      // ć˘ĺ­ăŽăŤăźă ăĺĺž
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (roomError) throw roomError;

      // ăŤăźă ĺăŽăăŹă¤ă¤ăźć°ăç˘şčŞ
      const { data: playersData, error: playersCountError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId);
      
      if (playersCountError) throw playersCountError;
      
      if (playersData.length >= roomData.max_players) {
        throw new Error('ăŤăźă ăŻćşĺĄă§ă');
      }

      // ć˘ăŤĺĺ ć¸ăżăç˘şčŞ
      const existingPlayer = playersData.find(p => p.id === playerId);
      
      if (!existingPlayer) {
        // ăăŹă¤ă¤ăźăăăźăżăăźăšăŤçťé˛
        const { error: playerError } = await supabase
          .from('players')
          .insert([{
            id: playerId,
            room_id: roomId,
            name: playerName,
            chips: 1000,
            hand: [],
            is_active: true
          }]);
        
        if (playerError) throw playerError;
      }

      // WebSocketăŤćĽçś
      connectWebSocket(roomId, playerId);
      
      // ăŤăźă ă¸ç§ťĺ
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      setError(error.message);
    }
  };

  // ăŤăźă ćĺ ąăŽĺĺž
  const fetchRoomData = async (roomId) => {
    try {
      // ăŤăźă ćĺ ąăĺĺž
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
      
      if (roomError) throw roomError;
      setCurrentRoom(roomData);

      // ăăŹă¤ă¤ăźćĺ ąăĺĺž
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId);
      
      if (playersError) throw playersError;
      setPlayers(playersData);

      // čŞĺăŽăăłăă¨ćŽéŤăč¨­ĺŽ
      const currentPlayer = playersData.find(p => p.id === playerId);
      if (currentPlayer) {
        setPlayerHand(currentPlayer.hand || []);
        setChips(currentPlayer.chips);
      }

      // ă˛ăźă çśćăč¨­ĺŽ
      setGameState(roomData.game_state);

      // WebSocketăŤćĽçś
      connectWebSocket(roomId, playerId);
    } catch (error) {
      console.error('Error fetching room data:', error);
      setError(error.message);
    }
  };

  // ă˛ăźă ăéĺ§
  const startGame = async () => {
    if (!currentRoom) return;
    
    try {
      const deck = shuffleDeck(createDeck());
      const { hands, deck: remainingDeck, communityCards } = dealCards(deck, players.length);
      
      // ĺăăŹă¤ă¤ăźăŤăŤăźăăéă
      const updatedPlayers = players.map((player, index) => ({
        ...player,
        hand: hands[index]
      }));

      // ă˛ăźă çśćăć´ć°
      const newGameState = {
        status: 'betting',
        deck: remainingDeck,
        communityCards,
        pot: 0,
        currentPlayerIndex: 0,
        winner: null
      };

      // ăăźăżăăźăšăć´ć°
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ game_state: newGameState })
        .eq('id', currentRoom.id);
      
      if (roomError) throw roomError;

      // ăăŹă¤ă¤ăźăŽćć­ăć´ć°
      for (const player of updatedPlayers) {
        const { error: playerError } = await supabase
          .from('players')
          .update({ hand: player.hand })
          .eq('id', player.id);
        
        if (playerError) throw playerError;
      }

      // WebSocketă§ă˛ăźă éĺ§ăéçĽ
      sendMessage({
        type: 'game_started',
        roomId: currentRoom.id,
        gameState: newGameState
      });

      // çśćăć´ć°
      setGameState(newGameState);
      setPlayers(updatedPlayers);
      setPlayerHand(updatedPlayers.find(p => p.id === playerId)?.hand || []);
    } catch (error) {
      console.error('Error starting game:', error);
      setError(error.message);
    }
  };

  // ăăăăăă§ăăŻăăăŠăźăŤăăŞăŠăŽă˘ăŻăˇă§ăł
  const performAction = async (action, amount = 0) => {
    if (!currentRoom || gameState.status !== 'betting') return;
    
    try {
      const updatedGameState = { ...gameState };
      const currentPlayer = players[gameState.currentPlayerIndex];
      
      if (currentPlayer.id !== playerId) {
        throw new Error('ăăŞăăŽăżăźăłă§ăŻăăăžăă');
      }

      // ă˘ăŻăˇă§ăłăŤĺżăăĺŚç
      switch (action) {
        case 'check':
          // ä˝ăăăŞă
          break;
        case 'bet':
          if (amount <= 0 || amount > chips) {
            throw new Error('çĄĺšăŞăăăéĄă§ă');
          }
          updatedGameState.pot += amount;
          
          // ăăŹă¤ă¤ăźăŽăăăăć¸ăă
          const newChips = chips - amount;
          setChips(newChips);
          
          await supabase
            .from('players')
            .update({ chips: newChips })
            .eq('id', playerId);
          break;
        case 'fold':
          // ăăŹă¤ă¤ăźăéă˘ăŻăăŁăăŤăă
          await supabase
            .from('players')
            .update({ is_active: false })
            .eq('id', playerId);
          
          const updatedPlayers = players.map(p => {
            if (p.id === playerId) {
              return { ...p, is_active: false };
            }
            return p;
          });
          
          setPlayers(updatedPlayers);
          break;
        default:
          throw new Error('çĄĺšăŞă˘ăŻăˇă§ăłă§ă');
      }

      // ćŹĄăŽăăŹă¤ă¤ăźă¸
      let nextPlayerIndex = (gameState.currentPlayerIndex + 1) % players.length;
      
      // ă˘ăŻăăŁăăŞăăŹă¤ă¤ăźăć˘ă
      let activePlayersCount = 0;
      players.forEach(p => {
        if (p.is_active) activePlayersCount++;
      });
      
      // ă˘ăŻăăŁăăŞăăŹă¤ă¤ăźă1äşşăăăăŞăĺ ´ĺăă˛ăźă çľäş
      if (activePlayersCount <= 1) {
        const winner = players.find(p => p.is_active);
        updatedGameState.status = 'showdown';
        updatedGameState.winner = winner;
        
        // ĺčăŤăăăăĺ çŽ
        if (winner) {
          const newWinnerChips = winner.chips + updatedGameState.pot;
          await supabase
            .from('players')
            .update({ chips: newWinnerChips })
            .eq('id', winner.id);
          
          if (winner.id === playerId) {
            setChips(newWinnerChips);
          }
        }
      } else {
        // ćŹĄăŽă˘ăŻăăŁăăŞăăŹă¤ă¤ăźăčŚă¤ăă
        while (!players[nextPlayerIndex].is_active) {
          nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
        }
        updatedGameState.currentPlayerIndex = nextPlayerIndex;
      }

      // ă˛ăźă çśćăć´ć°
      await supabase
        .from('rooms')
        .update({ game_state: updatedGameState })
        .eq('id', currentRoom.id);
      
      // WebSocketă§ă˘ăŻăˇă§ăłăéçĽ
      sendMessage({
        type: 'player_action',
        roomId: currentRoom.id,
        playerId,
        action,
        amount,
        gameState: updatedGameState
      });
      
      setGameState(updatedGameState);
    } catch (error) {
      console.error('Error performing action:', error);
      setError(error.message);
    }
  };

  // ă˛ăźă ăăŞăťăă
  const resetGame = async () => {
    if (!currentRoom) return;
    
    try {
      const initialGameState = {
        status: 'waiting',
        deck: [],
        communityCards: [],
        pot: 0,
        currentPlayerIndex: 0,
        winner: null
      };

      // ă˛ăźă çśćăăŞăťăă
      await supabase
        .from('rooms')
        .update({ game_state: initialGameState })
        .eq('id', currentRoom.id);
      
      // ăăŹă¤ă¤ăźăŽćć­ăăŞăťăă
      for (const player of players) {
        await supabase
          .from('players')
          .update({ hand: [], is_active: true })
          .eq('id', player.id);
      }

      // WebSocketă§ăŞăťăăăéçĽ
      sendMessage({
        type: 'game_reset',
        roomId: currentRoom.id
      });

      // çśćăć´ć°
      setGameState(initialGameState);
      setPlayerHand([]);
      
      const updatedPlayers = players.map(p => ({
        ...p,
        hand: [],
        is_active: true
      }));
      
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error('Error resetting game:', error);
      setError(error.message);
    }
  };

  // ăŤăźă ăăéĺş
  const leaveRoom = async () => {
    if (!currentRoom) return;
    
    try {
      // ăăŹă¤ă¤ăźăéă˘ăŻăăŁăăŤăă
      await supabase
        .from('players')
        .update({ is_active: false })
        .eq('id', playerId);
      
      // WebSocketăéăă
      closeWebSocket();
      
      // ăŤăźă ä¸čŚ§ă¸ćťă
      router.push('/rooms');
    } catch (error) {
      console.error('Error leaving room:', error);
      setError(error.message);
    }
  };

  // ăăŹă¤ă¤ăźĺăŽč¨­ĺŽ
  const setPlayerNameAndSave = (name) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
  };

  // WebSocketăĄăăťăźă¸ăăłăăŠăź
  useEffect(() => {
    const removeHandler = addMessageHandler((message) => {
      if (!message || !message.type) return;
      
      switch (message.type) {
        case 'game_started':
          if (message.gameState) {
            setGameState(message.gameState);
            // čŞĺăŽćć­ăć´ć°
            if (message.playersData) {
              const playerData = message.playersData.find(p => p.id === playerId);
              if (playerData && playerData.hand) {
                setPlayerHand(playerData.hand);
              }
            }
          }
          break;
        case 'player_action':
          if (message.gameState) {
            setGameState(message.gameState);
          }
          break;
        case 'player_joined':
        case 'player_left':
          // ăăŹă¤ă¤ăźăŞăšăăć´ć°
          if (currentRoom) {
            fetchRoomData(currentRoom.id);
          }
          break;
        case 'game_reset':
          if (currentRoom) {
            fetchRoomData(currentRoom.id);
          }
          break;
        default:
          break;
      }
    });
    
    return () => {
      removeHandler();
      closeWebSocket();
    };
  }, [currentRoom, playerId]);

  const contextValue = {
    playerId,
    playerName,
    setPlayerName: setPlayerNameAndSave,
    rooms,
    fetchRooms,
    createRoom,
    joinRoom,
    currentRoom,
    players,
    gameState,
    playerHand,
    chips,
    fetchRoomData,
    startGame,
    performAction,
    resetGame,
    leaveRoom,
    error,
    setError
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
