const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    try {
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decodeToken.id).select('-password')
      if (!req.user) {
        res.status(401)
        throw new Error('Not authorized')
      }
      return next()
    } catch (err) {
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  res.status(401)
  throw new Error('Not authorized')
})

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  res.status(403)
  throw new Error('Admin access only')
}

module.exports = { protect, adminOnly }
