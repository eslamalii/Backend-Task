const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017"

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(`Database Connection Error: ${err.message} `))
