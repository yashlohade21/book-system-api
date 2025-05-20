const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Prevent user from submitting more than one review per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to get average rating
reviewSchema.statics.getAverageRating = async function(bookId) {
  const obj = await this.aggregate([
    {
      $match: { book: new mongoose.Types.ObjectId(bookId) }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await this.model('Book').findByIdAndUpdate(bookId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10
      });
    } else {
      await this.model('Book').findByIdAndUpdate(bookId, {
        averageRating: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.book);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.book);
});

module.exports = mongoose.model('Review', reviewSchema);