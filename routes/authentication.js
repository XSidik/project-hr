const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// JWT Secret Key
const secretKey = 'my_secret_key_is_asdfwer@#!$%wefwecd';

// Register User Route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ user_name: username, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { user_name: username } });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.encode({ id: user.id, username }, secretKey);
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;