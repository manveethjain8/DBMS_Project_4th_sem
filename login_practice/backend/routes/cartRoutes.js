const express = require('express');
const router = express.Router();
const {
  getCartByUserId,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  deleteCartItem,
  deleteCartByUserId
} = require('../controllers/cartController'); 

// Routes
router.get('/:userId', getCartByUserId);
router.post('/add-to-cart', addToCart);
router.patch('/increment/:id', incrementQuantity);
router.patch('/decrement/:id', decrementQuantity);
router.delete('/delete/:id', deleteCartItem);
router.delete('/delete-cart/:userId', deleteCartByUserId);

module.exports = router;
