const express = require('express');
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Mount review routes
router.route('/')
  .get(getReviews)
  .post(protect, addReview);

// Mount individual review routes
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;