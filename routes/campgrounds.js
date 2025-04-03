const express = require('express');
const router = express.Router();

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');


// Show all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}));

// Show the page to add new campground
// Should write before :id, or new will be treated as id
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Add new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);

}));

// Show the campground that you click
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);

    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds'); // return will stop the codes, will not implement res.render
    }
    res.render('campgrounds/show', { campground });
}));

// show the edit page of the campground you click
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds'); // return will stop the codes, will not implement res.render
    }
    res.render('campgrounds/edit', { campground });
}));

// Update the information of the campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect('/campgrounds');
}));

module.exports = router;