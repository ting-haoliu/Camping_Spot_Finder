require('dotenv').config();
const mongoose = require('mongoose');
const { cities } = require('./cities');
const { descriptors, places } = require('./seedsHelpers');
const Campground = require('../models/campground');

const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(databaseUrl);

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
            const price = Math.floor(Math.random() * 20) + 10;

            const camp = new Campground({
                title: `${sample(descriptors)} ${sample(places)}`,
                images: [
                    {
                        url: 'https://res.cloudinary.com/dqwtiueci/image/upload/v1745451337/lex-sirikiat-oT4hTqWoZ6M-unsplash_qbmx8l.jpg',
                        filename: 'YelpCamp/camp1',
                    },
                    {
                        url: 'https://res.cloudinary.com/dqwtiueci/image/upload/v1745451337/huang-gugu-XFdbJErDA9k-unsplash_y83gn6.jpg',
                        filename: 'YelpCamp/camp2',
                    },
                    {
                        url: 'https://res.cloudinary.com/dqwtiueci/image/upload/v1745451337/jack-cohen-pCYlHZAXfMI-unsplash_pxsosl.jpg',
                        filename: 'YelpCamp/camp3',
                    },
                    {
                        url: 'https://res.cloudinary.com/dqwtiueci/image/upload/v1745451337/bryce-wendler-tWiwsYHWqzs-unsplash_scofbu.jpg',
                        filename: 'YelpCamp/camp4',
                    },
                    {
                        url: 'https://res.cloudinary.com/dqwtiueci/image/upload/v1745451110/lindsay-doyle-d5eVCBBOZY4-unsplash_nfb9th.jpg',
                        filename: 'YelpCamp/camp5',
                    }
                ],
                price,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque voluptas dolores qui non, facilis repellendus omnis corrupti tenetur consectetur eos! Voluptas nostrum fuga quasi voluptatum doloremque sunt dolores ea repudiandae',
                location: `${sample(cities).city}, ${sample(cities).state}`,
                author: '67eaf2f07d4c0ff9fa16b574'
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