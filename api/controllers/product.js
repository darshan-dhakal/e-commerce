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

const handleCreateProduct = async (req, res) => {
  const {
    name,
    image,
    description,
    price,
    countInStock,
    category,
    discount,
    discountType
  } = req.body

  const product = await Product.create({
    name,
    image,
    description,
    price,
    countInStock,
    category,
    discount,
    discountType
  })

  res.status(201).json(product)
}

const handleUpdateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('product not found')
  }

  product.name = req.body.name ?? product.name
  product.image = req.body.image ?? product.image
  product.description = req.body.description ?? product.description
  product.price = req.body.price ?? product.price
  product.countInStock = req.body.countInStock ?? product.countInStock
  product.category = req.body.category ?? product.category
  product.discount = req.body.discount ?? product.discount
  product.discountType = req.body.discountType ?? product.discountType

  const updatedProduct = await product.save()
  res.json(updatedProduct)
}

const handleDeleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('product not found')
  }

  await product.deleteOne()
  res.json({ message: 'product removed' })
}

module.exports = {
  handleGetAllProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct
}
