const express = require('express');
const router = express.Router();
const { getOrdersByUserId, summonOrder, deleteContract } = require('../controllers/orderController');

// Get all orders for a specific user
router.get('/:userId', getOrdersByUserId);

// Place a new order (summon)
router.post('/summon', summonOrder);

// Delete a contract by contractId and userId
router.delete('/delete-contract', deleteContract);

module.exports = router;
