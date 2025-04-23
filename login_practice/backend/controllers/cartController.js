const Cart = require('../models/Cart');

// Get cart items by userId
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ msg: 'userId is required' });

    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ msg: 'Error retrieving the cart' });
  }
};

// Add to cart or increment quantity
const addToCart = async (req, res) => {
  const { userId, creatureId, name, cost, description, image } = req.body;

  if (!userId || !creatureId || !name || !cost || !description || !image) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    const cartItem = await Cart.findOne({ userId, creatureId });

    if (cartItem) {
      cartItem.quantity += 1;
      const updatedItem = await cartItem.save();
      res.json(updatedItem);
    } else {
      const newItem = new Cart({
        userId,
        creatureId,
        name,
        cost,
        description,
        image,
        quantity: 1,
      });
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    }
  } catch (err) {
    res.status(400).json({ msg: 'Error adding to cart' });
  }
};

// Increment quantity by Cart document _id
const incrementQuantity = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ msg: 'Item not found' });

    cartItem.quantity += 1;
    const updatedItem = await cartItem.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ msg: 'Error incrementing item' });
  }
};

// Decrement quantity or delete if quantity is 1
const decrementQuantity = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ msg: 'Item not found' });

    if (cartItem.quantity === 1) {
      await Cart.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Item removed from cart' });
    }

    cartItem.quantity -= 1;
    const updatedItem = await cartItem.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ msg: 'Error decrementing item' });
  }
};

// Delete item from cart by _id
const deleteCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted from cart' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting item from cart' });
  }
};

// Delete all items from cart by userId
const deleteCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.json({ msg: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting the cart' });
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  deleteCartItem,
  deleteCartByUserId,
};
