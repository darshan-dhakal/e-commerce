const User = require('../models/user')
const generateToken = require('../tokenGenerate')

const handleRegisterUser = async (req, res) => {
  const { name, email, password } = req.body
  const existUser = await User.findOne({ email })
  if (existUser) {
    res.status(409)
    throw new Error('User already exist')
  } else {
    const user = await User.create({
      name,
      email,
      password
    })

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  }
}

const handleLoginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt
    })
  } else {
    res.status(401)
    throw new Error('Invalid Email or Password')
  }
}

const handleUpdateUser = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

const handleGetUserById = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: generateToken(user._id),
      createdAt: user.createdAt
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

const handleListUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ _id: -1 })
  res.json(users)
}

const handleGetUserDetail = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  res.json(user)
}

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleUpdateUser,
  handleGetUserById,
  handleListUsers,
  handleGetUserDetail
}
