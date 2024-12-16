const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const validator = require('validator');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    const phoneRegex =  /^(\+234|0)(70[0-9]|80[0-9]|81[0-9]|90[0-9]|91[0-9])[0-9]{6}$/; // Adjust regex if needed
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Password length validation
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = new User({ name, email, phone, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({
            message: 'Login successful',
            token,
            role: user.role // Include the role in the response
        });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
