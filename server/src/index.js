const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/users', require('./routes/users'));
app.use('/api/rapport', require('./routes/rapport'));
app.use('/api/client', require('./routes/client'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
