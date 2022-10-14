const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

// Create User
router.post('/user', async (req, res) => {
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// Login User
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

// Logout User
router.post('/user/logout', auth, async (req, res) => {
  try {
    console.log(req.user.token)

    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/user', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
