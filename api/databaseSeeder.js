const router = require('express').Router();
const user = require('./models/user');
const users = require('./data/users');
const product = require('./models/product');
const products = require('./data/products');
const asyncHandler = require('express-async-handler');


router.post('/users', asyncHandler(
  async (req, res) => {
    await user.deleteMany({});
    const userSeeder = await user.insertMany(users);
    res.send({ userSeeder })
  }
)
);

router.post('/products', asyncHandler(
  async (req, res) => {
    await product.deleteMany({});
    const productSeeder = await product.insertMany(products);
    res.send({ productSeeder })
  }
)
);

module.exports = router;