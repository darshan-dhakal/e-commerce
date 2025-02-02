const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const products = require('./data/products')
const databaseSeeder = require('./databaseSeeder')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order')

const app = express()

dotenv.config()
const PORT = process.env.PORT
const MONGOOSEDB_URL = process.env.MONGOOSEDB_URL

mongoose
  .connect(MONGOOSEDB_URL)
  .then(() => console.log('db connected'))
  .then(err => {
    err
  })

app.use(express.json())
//database seeder routes
app.use('/api/seed', databaseSeeder)

//routes for user
app.use('/api/users', userRoute)

//routes for product
app.use('/api/products', productRoute)

app.use('/api/orders', orderRoute)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})

//darshandhakal77
//8h9ih3V5vXhmpVl9
//mongodb+srv://darshandhakal77:8h9ih3V5vXhmpVl9@cluster0.tvojy.mongodb.net/react-node-app

//api product test route
// app.get("/api/products", (req, res) => {
//   res.json(products);
// });

// app.get("/api/products/:id", (req, res) => {
//   const product = products.find((product) => product.id === req.params.id)
//   res.json(product);
// });

// echo "# react-node-app" >> README.md
// git init
// git add README.md
// git commit - m "first commit"
// git branch - M main
// git remote add origin https://github.com/darshan-dhakal/react-node-app.git
// git push - u origin main

// {
//   "orderItems":[
//       {
//           "name":"Lorem anim anim",
//           "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/584dcc48a1734ca4baf314572273e64e_9366/Stan_Smith_Crepe_Shoes_White_IG5531_01_standard.jpg",
//           "qty": 1,
//           "price": 98,
//           "product": "67824c1824fc47447f4ac3f2"

//       }
//   ],
//   "shippingAddress":{
//   "address":"inaruwwa, nepal",
//   "city": "inaruwa",
//   "postalCode":"123446",
//   "country": "nepal"
//   },
//   "shippingPrice":100,
//   "taxPrice":13,
//   "totalPRice":113,
//   "price":98
// }
