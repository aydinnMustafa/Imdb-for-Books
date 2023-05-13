const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  star: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports = mongoose.model('Book', bookSchema);