const express = require('express');
const router = express.Router();
const { startDragonGame, makeMove, getPlayerStats } = require('../controllers/dragonGameController');

router.post('/start', startDragonGame);
router.post('/move', makeMove);
router.get('/playerStats', getPlayerStats);

module.exports = router;
