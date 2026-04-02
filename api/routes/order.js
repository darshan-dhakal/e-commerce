const orderRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const { protect, adminOnly } = require('../middleware/auth')
const {
  handleGetOrder,
  handlePayment,
  handleListOrder,
  handleOrderDetail,
  handleListAllOrders,
  handleUpdateOrderStatus,
  handleAddOrderNote,
  handleRequestRefund,
  handleApproveRefund,
  handleCompleteRefund,
  handleRejectRefund
} = require('../controllers/order')

orderRoute.post('/', protect, asyncHandler(handleGetOrder))

orderRoute.put('/:id/payment', protect, asyncHandler(handlePayment))

orderRoute.get('/', protect, asyncHandler(handleListOrder))

orderRoute.get('/:id', protect, asyncHandler(handleOrderDetail))

orderRoute.get(
  '/admin/all',
  protect,
  adminOnly,
  asyncHandler(handleListAllOrders)
)

orderRoute.put(
  '/:id/status',
  protect,
  adminOnly,
  asyncHandler(handleUpdateOrderStatus)
)

orderRoute.post(
  '/:id/notes',
  protect,
  adminOnly,
  asyncHandler(handleAddOrderNote)
)

orderRoute.post(
  '/:id/refund/request',
  protect,
  asyncHandler(handleRequestRefund)
)

orderRoute.put(
  '/:id/refund/approve',
  protect,
  adminOnly,
  asyncHandler(handleApproveRefund)
)

orderRoute.put(
  '/:id/refund/complete',
  protect,
  adminOnly,
  asyncHandler(handleCompleteRefund)
)

orderRoute.put(
  '/:id/refund/reject',
  protect,
  adminOnly,
  asyncHandler(handleRejectRefund)
)

module.exports = orderRoute
