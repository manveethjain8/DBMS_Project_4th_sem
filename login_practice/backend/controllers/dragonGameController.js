const User = require('../models/User');

const startGame = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'User ID required' });

  return res.json({
    playerHealth: 100,
    dragonHealth: 100,
    battleLog: ['The battle begins!'],
  });
};

const makeMove = async (req, res) => {
  const { userId, playerHealth, dragonHealth, battleLog } = req.body;

  if (!userId || playerHealth == null || dragonHealth == null) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  const log = [...battleLog];
  const playerHit = Math.floor(Math.random() * 20) + 1;
  const dragonHit = Math.floor(Math.random() * 20) + 1;

  let newPlayerHealth = playerHealth - dragonHit;
  let newDragonHealth = dragonHealth - playerHit;

  log.push(`You hit the dragon for ${playerHit} damage!`);
  log.push(`The dragon hit you for ${dragonHit} damage!`);
  log.push(`Your health: ${newPlayerHealth}, Dragon's health: ${newDragonHealth}`);

  let gameOver = false;
  let resultMessage = null;

  if (newPlayerHealth <= 0 && newDragonHealth <= 0) {
    resultMessage = "You both fell in battle. It's a draw!";
    gameOver = true;
  } else if (newPlayerHealth <= 0) {
    resultMessage = "You were defeated by the dragon...";
    gameOver = true;
  } else if (newDragonHealth <= 0) {
    resultMessage = "You have slain the dragon!";
    gameOver = true;

    // Award coins
    try {
      const user = await User.findById(userId);
      if (user) {
        user.credits += 50;
        await user.save();
        log.push("You earned 50 coins!");
      }
    } catch (err) {
      return res.status(500).json({ message: 'Failed to award coins', error: err.message });
    }
  }

  return res.json({
    playerHealth: newPlayerHealth,
    dragonHealth: newDragonHealth,
    battleLog: log,
    gameOver,
    resultMessage,
  });
};

const getPlayerStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    // Fetch the correct fields: firstName, lastName, and credits
    const user = await User.findById(userId, 'firstName lastName credits');

    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('Fetched User:', user);

    return res.json({
      username: `${user.firstName} ${user.lastName}`, // Combine firstName and lastName as username
      coins: user.credits, // Return the credits as coins
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching player stats', error: err.message });
  }
};

module.exports = {
  startGame,
  makeMove,
  getPlayerStats
};
