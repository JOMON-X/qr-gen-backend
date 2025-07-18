require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', ' DB connected');
  })
  .catch((error) => {
    console.error(' DB connection error:', error);
    process.exit(1); // Stops the function to prevent timeout
  });

module.exports = mongoose