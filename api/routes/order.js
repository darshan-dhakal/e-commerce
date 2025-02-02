const orderRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const protect = require('../middleware/auth')
const {
  handleGetOrder,
  handlePayment,
  handleListOrder,
  handleOrderDetail
} = require('../controllers/order')

orderRoute.post('/', protect, asyncHandler(handleGetOrder))

orderRoute.put('/:id/payment', protect, asyncHandler(handlePayment))

orderRoute.get('/', protect, asyncHandler(handleListOrder))

orderRoute.get('/:id', protect, asyncHandler(handleOrderDetail))

module.exports = orderRoute
