const Order = require('../models/Orders');

// Get all orders for a specific user
const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orderItems = await Order.find({ userId });
        console.log('Backend Orders retrieval', orderItems);
        res.json(orderItems);
    } catch (err) {
        res.status(500).json({ msg: 'Error retrieving the orders' });
    }
};

// Place a new order (summon)
const summonOrder = async (req, res) => {
    try {
        const { userId, familiars, totalCost, dateTime } = req.body;

        const newOrder = new Order({
            userId,
            familiars,
            totalCost,
            dateTime,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ msg: 'Error placing the order' });
    }
};

// Delete an order contract
const deleteContract = async (req, res) => {
    try {
        const { contractId, userId } = req.body;
        await Order.findOneAndDelete({ _id: contractId, userId: userId });
        res.json({ msg: 'Contract deleted' });
    } catch (err) {
        res.status(400).json({ msg: 'Error deleting the contract' });
    }
};

module.exports = { getOrdersByUserId, summonOrder, deleteContract };
