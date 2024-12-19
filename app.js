require('dotenv').config();
const express = require('express');
const path = require('path');
const mainController = require('./controllers/mainController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', mainController);

// Start server
const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});

module.exports = { app, server };
