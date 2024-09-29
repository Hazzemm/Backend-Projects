require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'Access denied, no token provided' });
  const extractedToken = token.split(' ')[1]; 
  try {
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
    req.user = decoded; // This contains the user ID and role
    next();
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied, admin only' });
  }
  next();
}

module.exports = { verifyToken, adminOnly };