const Creature = require('../models/Creatures');

// Get all creatures
const getAllCreatures = async (req, res) => {
    try {
        const creatures = await Creature.find();
        res.json(creatures);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error fetching creatures', error: err.message });
    }
};

module.exports = { getAllCreatures };
