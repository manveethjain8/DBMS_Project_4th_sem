const express = require('express');
const router = express.Router();
const { getUserById, registerUser, loginUser, updateCredits } = require('../controllers/userController');

// Routes
router.get('/:id', getUserById);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.patch('/update-credits/:id', updateCredits);

module.exports = router;
