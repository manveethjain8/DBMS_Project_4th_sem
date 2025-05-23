import React, { useState, useEffect, useContext } from 'react';
import api1 from '../api/axios1';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/dataContext';
import '../css_files/DragonGame.css';

function DragonGame() {
  const {
    loggedInUser,
    setLoggedInUser,
    credits,
    setCredits,
    setCreditsTrigger,
    familiars,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const [playerHealth, setPlayerHealth] = useState(100);
  const [dragonHealth, setDragonHealth] = useState(100);
  const [battleLog, setBattleLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFamiliar, setSelectedFamiliar] = useState(familiars[0]); // Default to first familiar if available
  const [activatedFamiliars, setActivatedFamiliars] = useState([]);

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    } else {
      fetchPlayerStats();
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    const availableFamiliars = familiars.filter(familiar => familiar.contract === true);
    setActivatedFamiliars(availableFamiliars);
    if (availableFamiliars.length > 0 && !selectedFamiliar) {
      setSelectedFamiliar(availableFamiliars[0]);
    }
  }, [familiars]); // Only depends on familiars


  const fetchPlayerStats = async () => {
    try {
      const res = await api1.get(`/game/playerStats?userId=${loggedInUser.id}`);
      setCredits(res.data.coins);
      setLoggedInUser(prevUser => ({
        ...prevUser,
        credits: res.data.coins,
      }));
      setCreditsTrigger(prev => !prev);
    } catch (err) {
      setError('Failed to fetch player stats');
    }
  };

const startGame = async () => {
  const familiarToSend = {
    name: selectedFamiliar?.name,   
    image: selectedFamiliar?.image,
    familiarId: selectedFamiliar?.familiarId || selectedFamiliar?._id,  // ✅ fallback to _id
  };

  console.log("Final familiar sent to startGame:", familiarToSend);
  console.log('loggedInUser', loggedInUser);
    try {
      const res = await api1.post('http://localhost:5000/game/start', {
        userId: loggedInUser.id,
        familiar: familiarToSend,
      });
    

    console.log('Game started successfully:', res.data);

    setPlayerHealth(res.data.playerHealth);
    setDragonHealth(res.data.dragonHealth);
    setBattleLog(res.data.battleLog || []);
    setResultMessage('');
    setGameOver(false);
  } catch (err) {
    setError('Error starting the game');
    console.error("Error during start game:", err);
  }
};


const makeMove = async () => {
  if (!selectedFamiliar) {
    setError('Please select a familiar to make a move!');
    return;
  }

  try {
    const res = await api1.post('/game/move', {
      userId: loggedInUser.id,
      familiarId: selectedFamiliar?.familiarId || selectedFamiliar?._id, // Handling both cases
      playerHealth,
      dragonHealth,
      battleLog,
    });

    // Update the UI with new game state
    setPlayerHealth(res.data.playerHealth);
    setDragonHealth(res.data.dragonHealth);
    setBattleLog(res.data.battleLog);

    if (res.data.gameOver) {
      setGameOver(true);
      setResultMessage(res.data.resultMessage);
      fetchPlayerStats();  // Make sure this function updates relevant player stats
    }
  } catch (err) {
    // More detailed error handling
    if (err.response && err.response.data) {
      setError(`Error during move: ${err.response.data.message || err.message}`);
    } else {
      setError('Error during move');
    }
  }
};

  return (
    <div className="game-container">
      <div className='dragonGameHeader'>
        <Link to='/mythicalCreatures'><p className='dragonGameMythicalCreaturesText'>Mythical Creatures</p></Link>
      </div>
      <h2>🐉 Dragon Slayer</h2>

      <div className="stats">
        <p>Coins: <span className="coins">{credits}</span></p>
      </div>

      {/* Familiar Selection */}
      <div className="familiar-selection">
        <label>Select Familiar:</label>
        <div className="familiar-options">
          {activatedFamiliars.map(fam => (
            <div
              key={fam._id}
              className={`familiar-option ${selectedFamiliar && selectedFamiliar._id === fam._id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedFamiliar(fam);
                console.log('Selected Familiar:', fam);  // Console log to check selected familiar
              }}
            >
              <img src={fam.image} alt={fam.name} className="familiar-icon" />
              <div>
                <strong>{fam.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Bars */}
      <div className="health-info">
        <div className="health-bar-container">
          <div className="health-bar">
            <div className="health player-health" style={{ width: `${playerHealth}%`, backgroundColor: 'green' }}></div>
          </div>
          <span className="span">🧍 Your Health: {playerHealth}</span>
        </div>

        <div className="health-bar-container">
          <div className="health-bar">
            <div className="health dragon-health" style={{ width: `${dragonHealth}%`, backgroundColor: 'red' }}></div>
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
