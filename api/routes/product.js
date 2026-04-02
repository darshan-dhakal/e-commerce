const productRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const { protect, adminOnly } = require('../middleware/auth')
const {
  handleGetAllProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct
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

productRoute.post('/', protect, adminOnly, asyncHandler(handleCreateProduct))

productRoute.put('/:id', protect, adminOnly, asyncHandler(handleUpdateProduct))

productRoute.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(handleDeleteProduct)
)

module.exports = productRoute
