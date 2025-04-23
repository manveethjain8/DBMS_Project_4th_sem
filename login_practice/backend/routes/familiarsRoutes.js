const express = require('express');
const router = express.Router();
const {
    getFamiliarsByUserId,
    addUserFamiliar,
    activateFamiliar,
    deactivateFamiliar,
    deleteFamiliar
} = require('../controllers/familiarController');  

// Get familiars for a specific user
router.get('/:userId', getFamiliarsByUserId);

// Add a new familiar
router.post('/add-user-familiar', addUserFamiliar);

// Activate a familiar
router.patch('/activate', activateFamiliar);

// Deactivate a familiar
router.patch('/deactivate', deactivateFamiliar);

// Delete a familiar
router.delete('/delete-familiar', deleteFamiliar);

module.exports = router;
