const express = require('express')
var morgan = require('morgan')
require('./db/mongoose')
const movieRouter = require('./routers/movie')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(movieRouter)
app.use(userRouter)
app.use(categoryRouter)

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
