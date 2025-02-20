const mongoose = require('mongoose');
const { Schema } = mongoose; //make this reference to let the reuse shortly

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);