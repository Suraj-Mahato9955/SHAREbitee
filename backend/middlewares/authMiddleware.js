const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log('========== AUTH CHECK ==========');
    console.log('AUTH HEADER:', req.headers.authorization);

    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      console.log('❌ NO TOKEN');
      return res.status(401).json({
        message: 'Not authorized, no token'
      });
    }

    const token = req.headers.authorization.split(' ')[1];

    console.log('TOKEN RECEIVED:', token ? 'YES' : 'NO');
    console.log('JWT SECRET EXISTS:', process.env.JWT_SECRET ? 'YES' : 'NO');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log('TOKEN VERIFIED:', decoded);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('❌ USER NOT FOUND:', decoded.id);

      return res.status(401).json({
        message: 'User not found, please login again'
      });
    }

    console.log('✅ USER AUTHENTICATED:', req.user.email);
    console.log('================================');

    next();

  } catch (error) {
    console.error('❌ AUTH ERROR:', error.message);

    return res.status(401).json({
      message: 'Not authorized',
      error: error.message
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      message: 'Not authorized as an admin'
    });
  }
};

const volunteer = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(401).json({
      message: 'Not authorized as a volunteer'
    });
  }
};

module.exports = {
  protect,
  admin,
  volunteer
};
