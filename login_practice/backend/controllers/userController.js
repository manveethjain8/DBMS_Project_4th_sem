const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const requiredUser = await User.findById(req.params.id);
        res.json({ requiredUser });
    } catch (err) {
        res.status(500).json({ msg: 'Error retrieving the user data' });
    }
};

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        res.status(200).json({
            msg: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                credits: user.credits,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Update user credits
const updateCredits = async (req, res) => {
    const { id } = req.params;
    const { credits } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { credits },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.status(200).json({
            msg: 'Credits updated',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                credits: user.credits,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { getUserById, registerUser, loginUser, updateCredits };
