const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  searchBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/search').get(searchBooks);

router.route('/:id').get(getBook);

module.exports = router;