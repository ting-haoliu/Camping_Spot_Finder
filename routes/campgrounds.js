const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// Show all campgrounds
router.get('/', catchAsync(campgrounds.index));

// Show the page to add new campground
// Should write before :id, or new will be treated as id
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Add new campground
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// Show the campground that you click
router.get('/:id', catchAsync(campgrounds.showCampground));

// show the edit page of the campground you click
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Update the information of the campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;