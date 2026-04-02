const userRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const { protect, adminOnly } = require('../middleware/auth')
const {
  handleRegisterUser,
  handleLoginUser,
  handleUpdateUser,
  handleGetUserById,
  handleListUsers,
  handleGetUserDetail
} = require('../controllers/user')

userRoute.post('/login', asyncHandler(handleLoginUser))

userRoute.post('/', asyncHandler(handleRegisterUser))
//get auth profile
userRoute.get('/profile', protect, asyncHandler(handleGetUserById))

userRoute.put('/profile', protect, asyncHandler(handleUpdateUser))

userRoute.get('/', protect, adminOnly, asyncHandler(handleListUsers))

userRoute.get('/:id', protect, adminOnly, asyncHandler(handleGetUserDetail))

module.exports = userRoute
