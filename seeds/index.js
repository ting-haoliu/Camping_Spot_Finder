const mongoose = require('mongoose');
const { cities } = require('./cities');
const { descriptors, places } = require('./seedsHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://dev-cluster:BHwOWheFaHRrEsK2@cluster0.7fte5.mongodb.net/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await Campground.deleteMany({}); // delete all documents in the campgrounds
        for (let i = 0; i < 50; i++) {
            const camp = new Campground({
                location: `${sample(cities).city}, ${sample(cities).state}`,
                title: `${sample(descriptors)} ${sample(places)}`
            });
            await camp.save();
        }
        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedDB();