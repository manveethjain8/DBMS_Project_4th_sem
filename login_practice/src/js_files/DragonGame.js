import React, { useState, useEffect, useContext } from 'react';
import api1 from '../api/axios1';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/dataContext';
import '../css_files/DragonGame.css';

function DragonGame() {
  const { loggedInUser, setLoggedInUser, credits, setCredits, creditsTrigger, setCreditsTrigger } = useContext(DataContext);
  const navigate = useNavigate();

  const [playerHealth, setPlayerHealth] = useState(100);
  const [dragonHealth, setDragonHealth] = useState(100);
  const [battleLog, setBattleLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    } else {
      fetchPlayerStats();
    }
  }, [loggedInUser, navigate]);

  // Fetch player stats and credits
  const fetchPlayerStats = async () => {
    try {
      const res = await api1.get(`/game/playerStats?userId=${loggedInUser.id}`);
      setCredits(res.data.coins); // Update credits from API response

      // Optionally, update the loggedInUser credits
      setLoggedInUser(prevUser => ({
        ...prevUser,
        credits: res.data.coins,
      }));

      // Trigger credits update
      setCreditsTrigger(prev => !prev); // Trigger to sync credits across the app
    } catch (err) {
      setError('Failed to fetch player stats');
    }
  };

  const startGame = async () => {
    try {
      const res = await api1.post('/game/start', { userId: loggedInUser.id });
      setPlayerHealth(res.data.playerHealth);
      setDragonHealth(res.data.dragonHealth);
      setBattleLog(res.data.battleLog || []);
      setResultMessage('');
      setGameOver(false);
    } catch (err) {
      setError('Error starting the game');
    }
  };

  const makeMove = async () => {
    try {
      const res = await api1.post('/game/move', {
        userId: loggedInUser.id,
        playerHealth,
        dragonHealth,
        battleLog,
      });

      setPlayerHealth(res.data.playerHealth);
      setDragonHealth(res.data.dragonHealth);
      setBattleLog(res.data.battleLog);

      if (res.data.gameOver) {
        setGameOver(true);
        setResultMessage(res.data.resultMessage);
        fetchPlayerStats(); // Refresh coins after the game is over
      }
    } catch (err) {
      setError('Error during move');
    }
  };

  return (
    <div className="game-container">
      <h2>🐉 Dragon Slayer</h2>

      {/* Displaying Credits */}
      <div className="stats">
        <p>Coins: <span className="coins">{credits}</span></p>
      </div>

      {/* Health Bars for Player and Dragon */}
      <div className="health-info">
      <div className="health-bar-container">
        <div className="health-bar">
          <div className="health player-health" style={{ width: `${playerHealth}%`, BackgroundColor: 'green' }}></div>
        </div>
        <span className="span">🧍 Your Health: {playerHealth}</span>
      </div>

      <div className="health-bar-container">
        <div className="health-bar">
          <div className="health dragon-health" style={{ width: `${dragonHealth}%` }}></div>
        </div>
        <span className="span">🐲 Dragon Health: {dragonHealth}</span>
      </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {!gameOver ? (
          <>
            <button className="btn start-btn" onClick={startGame}>Start New Game</button>
            <button className="btn attack-btn" onClick={makeMove}>Attack!</button>
          </>
        ) : (
          <>
            <p style={{ color: 'red' }}>{resultMessage}</p>
            <button className="btn restart-btn" onClick={startGame}>Restart</button>
          </>
        )}
      </div>

      {/* Battle Log */}
      {battleLog.length > 0 && (
        <div className="battle-log">
          <h3>Battle Log</h3>
          <ul>
            {battleLog.map((entry, idx) => (
              <li key={idx} className="battle-log-entry">{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default DragonGame;
