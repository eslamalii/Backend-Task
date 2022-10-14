const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          console.log('Email validation failed')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error(`Password cannot contain "password"`)
        }
      },
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

userScheme.virtual('movies', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'user',
})

// Hide data from the user
userScheme.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// Authenticate the user
userScheme.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'newuser', {
    expiresIn: '2h',
  })

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// Check to login
userScheme.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error(`Unable to login`)
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// Hash the password before saving
userScheme.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userScheme)

module.exports = User
