const express = require("express")
const { findById } = require("../models/movie")
const Movie = require("../models/movie")
const router = new express.Router()

// Add a Movie
router.post("/movie", async (req, res) => {
  const movie = new Movie(req.body)

  try {
    await movie.save()
    res.status(201).send(movie)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get all movies
router.get("/movie", async (req, res) => {
  try {
    const movies = await Movie.find({})
    res.send(movies)
  } catch (err) {
    res.status(500).send(err)
  }
})

// Update Movie By Id
router.patch("/movie/:id", async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["title", "description", "rate", "image"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" })
  }

  try {
    const movie = await Movie.findById(req.params.id)

    updates.forEach((update) => (movie[update] = req.body[update]))

    await movie.save()

    if (!movie) {
      return res.status(404).send()
    }

    res.send(movie)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Delete Movie
router.delete("/movie/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)

    if (!movie) {
      res.status(404).send()
    }

    res.send(movie)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
