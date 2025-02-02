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
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order Not Found')
  }
}

module.exports = {
  handleGetOrder,
  handlePayment,
  handleListOrder,
  handleOrderDetail
}
