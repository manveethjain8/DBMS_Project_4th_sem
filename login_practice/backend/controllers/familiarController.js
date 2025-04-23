const Familiar = require('../models/Familiars');

// Get familiars for a specific user
const getFamiliarsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const userFamiliars = await Familiar.find({ userId });
        res.json(userFamiliars);
    } catch (err) {
        console.log('Error fetching user familiars');
        res.status(500).json({ msg: 'Error fetching user familiars' });
    }
};

// Add a new familiar to the user
const addUserFamiliar = async (req, res) => {
    try {
        const { userId, orderId, name, image, dateTime, contract } = req.body;

        const newFamiliar = new Familiar({
            userId,
            orderId,
            name,
            image,
            dateTime,
            contract,
        });

        const savedFamiliar = await newFamiliar.save();
        res.status(201).json(savedFamiliar);
    } catch (err) {
        res.status(400).json({ msg: 'Error adding new familiar' });
    }
};

// Activate a familiar
const activateFamiliar = async (req, res) => {
    try {
        const { familiarId, familiarUserId } = req.body;

        const requiredFamiliar = await Familiar.findOne({ _id: familiarId, userId: familiarUserId });
        if (requiredFamiliar) {
            requiredFamiliar.contract = true;
            const updatedFamiliar = await requiredFamiliar.save();
            res.json(updatedFamiliar);
        }
    } catch (err) {
        res.status(500).json({ msg: 'Error activating familiar' });
    }
};

// Deactivate a familiar
const deactivateFamiliar = async (req, res) => {
    try {
        const { familiarId, familiarUserId } = req.body;

        const requiredFamiliar = await Familiar.findOne({ _id: familiarId, userId: familiarUserId });
        if (requiredFamiliar) {
            requiredFamiliar.contract = false;
            const updatedFamiliar = await requiredFamiliar.save();
            res.json(updatedFamiliar);
        }
    } catch (err) {
        res.status(500).json({ msg: 'Error deactivating familiar' });
    }
};

// Delete a familiar
const deleteFamiliar = async (req, res) => {
    try {
        const { familiarId, userId } = req.body;
        await Familiar.findOneAndDelete({ _id: familiarId, userId: userId });
        res.json({ msg: 'Familiar deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Error deleting familiar' });
    }
};

module.exports = {
    getFamiliarsByUserId,
    addUserFamiliar,
    activateFamiliar,
    deactivateFamiliar,
    deleteFamiliar,
};
