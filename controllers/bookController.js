const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/async');

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const books = await features.query.populate({
    path: 'user',
    select: 'name email'
  });

  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!book) {
    return next(
      new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private
exports.createBook = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    data: book
  });
});

// @desc    Search books
// @route   GET /api/v1/books/search
// @access  Public
exports.searchBooks = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search term', 400));
  }

  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } }
    ]
  });

  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});