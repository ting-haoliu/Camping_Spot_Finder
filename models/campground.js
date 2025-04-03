const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose; //make this reference to let the reuse shortly

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // Set up relationship
        }
    ]
});

// if a campground is deleted, the reviews on it will also be deleted
// Add this middleware => Because MongoDB will not delete related doc, not like SQL which has cascade delete
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);