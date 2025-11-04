const User = require('../models/user');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (error) {
    next(error);
  }
};

const updateParentalContact = async (req, res, next) => {
  try {
    const { parentEmail, parentPhone } = req.body;
    const user = req.user;

    if (parentEmail !== undefined) user.parentEmail = parentEmail;
    if (parentPhone !== undefined) user.parentPhone = parentPhone;

    await user.save();

    res.json({ message: 'Parental contact updated', user: { parentEmail: user.parentEmail, parentPhone: user.parentPhone } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  updateParentalContact,
};