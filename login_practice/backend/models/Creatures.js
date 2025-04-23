
const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hp: {
        type: Number,
        required: true,
    },
    dp: {
        type: Number,
        required: true,
    },
    rarity: {
        type: String,
        required: true,
    },
    dominantElement: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    lore: {
        type: String,
        required: true,
    },
    habitat: {
        type: String,
        required: true,
    },
    attackType: {
        type: String,
        required: true,
    },
    personality: {
        type: String,
        required: true,
    },
    alliances: {
        type: String,
        required: true,
    },
    battleTactics: {
        type: String,
        required: true,
    },
    lootDrops: {
        type: String,
        required: true,
    },
    hiddenAbilities: {
        type: String,
        required: true,
    },
    images: {
        creature: {
            type: String,
            required: true,
        },
        hp: {
            type: String,
            required: true,
        },
        dp: {
            type: String,
            required: true,
        },
        rarity: {
            type: String,
            required: true,
        },
        element: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Creature = mongoose.model('Creature', creatureSchema);

module.exports = Creature;
