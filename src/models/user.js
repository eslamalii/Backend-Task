const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        console.log("Email validation failed")
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(`Password cannot contain "password"`)
      }
    },
  },
  dateOfBirth: {
    type: Date,
    trim: true,
  },
})

userScheme.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})
module.exports = mongoose.model("User", userScheme)
