const User = require('../models/User');
const Familiar = require('../models/Familiars');  // Assuming you have a Familiar model
const Creature = require('../models/Creatures');  // Assuming you have a Creature model
const mongoose = require('mongoose');



// Function to start a new game
const startDragonGame = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const {userId,familiar } = req.body;

    if (!familiar || !familiar.familiarId) {
      return res.status(400).json({ message: 'Familiar data is incomplete' });
    }

    // Lookup creature stats using familiarId
    const baseCreature = await Creature.findById(familiar.familiarId); // Adjust model name/path if needed

    if (!baseCreature) {
      return res.status(404).json({ message: 'Base creature not found' });
    }

    console.log('Using Familiar:', familiar);
    console.log('Base Creature Stats:', baseCreature);

    const playerHealth = baseCreature.hp;
    const dragonHealth = 100; // or however you define this
    const battleLog = [`${familiar.name} enters the battle!`];

    res.json({
      playerHealth,
      dragonHealth,
      battleLog,
    });
  } catch (err) {
    console.error('Error starting game:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to make a move in the game
const makeMove = async (req, res) => {
  const { userId,familiarId, playerHealth, dragonHealth, battleLog } = req.body;

  if (!userId || playerHealth == null || dragonHealth == null) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  try {
    // Fetch the user's familiar to get the creature stats (HP and DP)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });


    // Fetch the creature stats from creaturesSchema
    const creature = await Creature.findById(familiarId);
    if (!creature) return res.status(404).json({ message: 'Creature not found' });

    const log = [...battleLog];

    // Use the familiar's DP (damage points) for the player's attack
    const playerHit = creature.dp;  // Use familiar's DP for player attack damage
    const dragonHit = Math.floor(Math.random() * 20) + 1;  // Random damage from the dragon

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

      // Award coins after slaying the dragon
      try {
        user.credits += 50;  // Add coins to the user's account
        await user.save();
        log.push("You earned 50 coins!");
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

  } catch (err) {
    return res.status(500).json({ message: 'Error during move', error: err.message });
  }
};

// Function to get player's stats
const getPlayerStats = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  try {
    // Fetch the correct fields: firstName, lastName, and credits
    const user = await User.findById(userId, 'firstName lastName credits familiarId');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get the familiar's data if it's selected
    const familiar = await Familiar.findOne({ userId: userId });

    let familiarStats = { hp: 100, dp: 10 };  // Default familiar stats if no familiar is selected
    if (familiar) {
      const creature = await Creature.findOne({ name: familiar.name });
      if (creature) {
        familiarStats = { hp: creature.hp, dp: creature.dp };  // Fetch HP and DP from creature
      }
    }

    return res.json({
      username: `${user.firstName} ${user.lastName}`, // Combine firstName and lastName as username
      coins: user.credits, // Return the credits as coins
      familiarStats,  // Include the familiar's stats (hp and dp)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching player stats', error: err.message });
  }
};

module.exports = {
  startDragonGame,
  makeMove,
  getPlayerStats,
};
