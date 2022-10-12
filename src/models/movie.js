const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  rate: {
    type: String,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  // category: {
  //   type: mongoose.Schema.ObjectId,
  //   required: true,
  //   ref: "Category",
  // },
})

module.exports = mongoose.model("Movie", movieSchema)
