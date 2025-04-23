const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing users
    ref: 'User',                          // Reference the User model
    required: true
  },
  creatureId: {
    type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing creatures
    ref: 'Creature',                      // Reference the Creature model
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
