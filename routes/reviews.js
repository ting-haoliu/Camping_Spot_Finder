const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensures that parameters defined in a parent router are accessible in a child router.

const reviews = require('../controllers/reviews');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');


// Add new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;