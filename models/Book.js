const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    trim: true,
    maxlength: [30, 'Genre cannot be more than 30 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  averageRating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);