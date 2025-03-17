const express = require('express');
const router = express.Router();

const { campgroundSchema } = require('../schemas.js'); // server side validation

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Show all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}));

// Show the page to add new campground
// should write before :id, or new will be treated as id
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Add new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}));

// Show the campground that you click
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// show the edit page of the campground you click
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// Update the information of the campground
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;