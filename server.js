// Imported required packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();

// MongoDB Database URL
// const mongoURI = 'mongodb://localhost:27017/online_kids_shop';
const mongoURI = process.env.MONGODB_URI;

// Connect MongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// Import Routes
const userRoutes = require('./Routes/User.route');
const employeeRoutes = require('./Routes/Employee.route');
const charityRoutes = require('./Routes/charityRoute')
const supplierRoutes = require('./Routes/SupplierRoute')
const productRoutes = require('./Routes/productRoute');
const communityRoutes = require('./Routes/communityRoute')

// Convert incoming data to JSON format
app.use(bodyParser.json());
app.use(cookieParser())

// Enable CORS
app.use(cors({
    origin: ["https://kidsreactjs.onrender.com"],
    credentials: true,
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup for the server port number
const PORT = process.env.PORT || 5000;

// Routes Configuration
app.use('/users', userRoutes);
// app.use('/employees', employeeRoutes);
app.use('/charity', charityRoutes);
app.use('/supplier', supplierRoutes);
app.use('/product', productRoutes);
app.use('/Community', communityRoutes);


// Start Express Server
app.listen(port, () => {
    console.log(`Server Listening On Port: ${port}`);
});
