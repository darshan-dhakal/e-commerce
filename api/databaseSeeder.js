const router = require('express').Router()
const user = require('./models/user')
const users = require('./data/users')
const product = require('./models/product')
const products = require('./data/products')
const asyncHandler = require('express-async-handler')

router.post(
  '/admin',
  asyncHandler(async (req, res) => {
    const adminSeeder = await user.insertMany(users)
    res.send({ adminSeeder })
  })
)

router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const productSeeder = await product.insertMany(products)
    res.send({ productSeeder })
  })
)

module.exports = router
