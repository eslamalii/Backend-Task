const express = require("express")
const router = new express.Router()
const User = require("../models/user")

router.post("/user", async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get("/user", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
