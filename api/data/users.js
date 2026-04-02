const bcrypt = require('bcryptjs')

const admin = [
  {
    name: 'Admin',
    email: 'admin@node.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  }
]

module.exports = admin
