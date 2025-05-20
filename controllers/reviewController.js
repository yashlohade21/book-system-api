const Review = require('../models/Review');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get reviews for a book
// @route   GET /api/v1/books/:bookId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bookId) {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate({
        path: 'user',
        select: 'name'
      })
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Add review
// @route   POST /api/v1/books/:bookId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.book = req.params.bookId;
  req.body.user = req.user.id;

  const book = await Book.findById(req.params.bookId);

  if (!book) {
    return next(
      new ErrorResponse(`No book with the id of ${req.params.bookId}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  // Update the review document
  Object.assign(review, req.body);
  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete review`, 401));
  }

  await review.deleteOne(); // Using deleteOne instead of deprecated remove()

  res.status(200).json({
    success: true,
    data: {}
  });
});