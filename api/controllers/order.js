const Order = require('../models/order')

const handleGetOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    taxPrice,
    totalPrice,
    price
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('no oder found')
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      price,
      user: req.user._id
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
}

const handlePayment = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.create_time,
      email_address: req.body.email_address
    }
    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order Not Found')
  }
}

const handleListOrder = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 })
  if (orders) {
    res.status(200).json(orders)
  } else {
    res.status(404)
    throw new Error('Orders Not Found')
  }
}

const handleOrderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email')
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  const isOwner =
    order.user && order.user._id.toString() === req.user._id.toString()
  if (!isOwner && !req.user.isAdmin) {
    res.status(403)
    throw new Error('Not authorized to view this order')
  }

  res.status(200).json(order)
}

const handleListAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .sort({ _id: -1 })
    .populate('user', 'email')
  res.status(200).json(orders)
}

const handleUpdateOrderStatus = async (req, res) => {
  const { status } = req.body
  if (
    !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(
      status
    )
  ) {
    res.status(400)
    throw new Error('Invalid status')
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  order.status = status

  if (status === 'delivered') {
    order.isDelivered = true
    order.deliveredAt = Date.now()
  } else if (status === 'cancelled') {
    order.isDelivered = false
  }

  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

const handleAddOrderNote = async (req, res) => {
  const { note } = req.body
  if (!note || note.trim() === '') {
    res.status(400)
    throw new Error('Note cannot be empty')
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  order.notes.push({
    note,
    createdBy: req.user.name || req.user.email
  })

  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

const handleRequestRefund = async (req, res) => {
  const { reason } = req.body
  if (!reason || reason.trim() === '') {
    res.status(400)
    throw new Error('Refund reason required')
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  if (!order.isPaid) {
    res.status(400)
    throw new Error('Can only refund paid orders')
  }

  if (order.refund.status !== 'none') {
    res.status(400)
    throw new Error('Refund already exists')
  }

  order.refund = {
    status: 'requested',
    reason,
    amount: order.totalPrice,
    requestedAt: Date.now()
  }

  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

const handleApproveRefund = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  if (order.refund.status !== 'requested') {
    res.status(400)
    throw new Error('Refund must be in requested state')
  }

  order.refund.status = 'approved'
  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

const handleCompleteRefund = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  if (order.refund.status !== 'approved') {
    res.status(400)
    throw new Error('Refund must be approved first')
  }

  order.refund.status = 'completed'
  order.refund.completedAt = Date.now()
  order.isPaid = false

  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

const handleRejectRefund = async (req, res) => {
  const { reason } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order Not Found')
  }

  if (order.refund.status !== 'requested') {
    res.status(400)
    throw new Error('Refund must be in requested state')
  }

  order.refund.status = 'rejected'
  order.notes.push({
    note: `Refund rejected: ${reason || 'No reason provided'}`,
    createdBy: 'admin'
  })

  const updatedOrder = await order.save()
  res.status(200).json(updatedOrder)
}

module.exports = {
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
}
