const express = require('express');
const router = express.Router();
const { startGame, makeMove, getPlayerStats } = require('../controllers/dragonGameController');

router.post('/start', startGame);
router.post('/move', makeMove);
router.get('/playerStats', getPlayerStats);

module.exports = router;
