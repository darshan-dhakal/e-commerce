const productRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const {
  handleGetAllProducts,
  handleGetProductById
} = require('../controllers/product')

productRoute.get('/', asyncHandler(handleGetAllProducts))

// productRoute.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const products = await Product.find({})
//     res.json(products)
//   })
// )

productRoute.get('/:id', asyncHandler(handleGetProductById))

module.exports = productRoute
