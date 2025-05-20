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

// Calculate average rating for a book
bookSchema.statics.getAverageRating = async function(bookId) {
  const obj = await this.aggregate([
    {
      $match: { _id: bookId }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'book',
        as: 'reviews'
      }
    },
    {
      $project: {
        averageRating: { $avg: '$reviews.rating' }
      }
    }
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating: obj[0]?.averageRating || 0
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Book', bookSchema);