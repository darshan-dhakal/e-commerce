const userRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
// const User = require('../models/user')
const generateToken = require('../tokenGenerate')
const protect = require('../middleware/auth')
const {
  handleRegisterUser,
  handleLoginUser,
  handleUpdateUser,
  handleGetUserById
} = require('../controllers/user')

userRoute.post('/login', asyncHandler(handleLoginUser))

userRoute.post('/', asyncHandler(handleRegisterUser))
//get auth profile
userRoute.get('/profile', protect, asyncHandler(handleGetUserById))

userRoute.put('/profile', protect, asyncHandler(handleUpdateUser))

module.exports = userRoute
