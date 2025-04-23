const express = require('express');
const router = express.Router();
const { getAllCreatures } = require('../controllers/creaturesController');  

// Get all creatures
router.get('/creatures', getAllCreatures);

module.exports = router;
