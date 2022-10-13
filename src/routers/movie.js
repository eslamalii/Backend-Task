const express = require('express')
const Movie = require('../models/movie')
const auth = require('../middleware/auth')
const router = new express.Router()

// Add a Movie
router.post('/movie', auth, async (req, res) => {
  const movie = new Movie(req.body)

  try {
    await movie.save()
    res.status(201).send(movie)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get all movies
router.get('/movie', auth, async (req, res) => {
  try {
    const movies = await Movie.find({})
    res.send(movies)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update Movie By Id
router.patch('/movie/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['title', 'description', 'rate', 'image']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' })
  }

  try {
    const movie = await Movie.findById(req.params.id)

    updates.forEach((update) => (movie[update] = req.body[update]))

    await movie.save()

    if (!movie) {
      return res.status(404).send()
    }

    res.send(movie)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Delete Movie
router.delete('/movie/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)

    if (!movie) {
      res.status(404).send()
    }

    res.send(movie)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
