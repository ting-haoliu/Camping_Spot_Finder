# YelpCamp
YelpCamp is a full-stack web application that allows users to browse, create, and review campgrounds. Inspired by Yelp, this app lets outdoor enthusiasts share information and experiences about various camping spots.

## Features

- User authentication (register/login/logout)
- CRUD operations for campgrounds
- Image upload with Cloudinary
- Review and rating system
- Authorization for editing/deleting own campgrounds/reviews
- Flash messages and input validation
- Responsive design using Bootstrap

## Test User

You can use the following account to log in and explore the app without creating a new user:  

- **Username**: `testuser`  
- **Password**: `12345`
> Note: You can also register your own account if you prefer.

## Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- EJS (Embedded JavaScript)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Local Strategy)

### Other Tools
- Cloudinary (image hosting)
- Multer (file upload middleware)
- Dotenv (environment variables)
- Connect-flash, method-override

## Installation
1. clone the project
   ```bash
   git clone https://github.com/ting-haoliu/YelpCamp.git

2. install all dependencies listed in the package.json file
   ```bash
   npm install

3. create data
   ```bash
   node seeds/index.js

4. start the server
   ```bash
   npm start

## License

This project is licensed under the [MIT License](LICENSE).
