const express = require('express')
const Category = require('../models/category')
const auth = require('../middleware/auth')
const router = new express.Router()

// Add Category
router.post('/category', auth, async (req, res) => {
  const category = new Category(req.body)

  try {
    await category.save()
    res.status(201).send(category)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get Categories
router.get('/category', auth, async (req, res) => {
  try {
    const categories = await Category.find({})
    res.send(categories)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update Category
router.patch('/category/:id', auth, async (req, res) => {
  const update = Object.keys(req.body)
  const allowedUpdates = 'title'
  const isValidOperation = update.includes(allowedUpdates)

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const category = await Category.findById(req.params.id)

    category[update] = req.body[update]

    await category.save()

    if (!category) {
      return res.status(404).send()
    }

    res.send(category)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete Category
router.delete('/category/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      res.status(404).send()
    }

    res.send(category)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
