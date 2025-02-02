const Product = require('../models/product')
// const Product = require('../models/product')

const handleGetAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.json(products)
}

const handleGetProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('product not found')
  }
}

module.exports = {
  handleGetAllProducts,
  handleGetProductById
}
