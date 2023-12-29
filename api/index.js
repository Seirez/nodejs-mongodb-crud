const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const employeesRoute = require('./employees');
const addEmployeeRoute = require('./addEmployee');
const editRoute = require('./edit');
const deleteRoute = require('./delete');

// Use middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like your HTML, CSS, and JS files)
app.use(express.static('public'));

// Define routes
app.use('/api/employees', employeesRoute);
app.use('/api/addEmployee', addEmployeeRoute);
app.use('/api/edit', editRoute);
app.use('/api/delete', deleteRoute);

// For any other route, serve the public/index.html
app.use('*', express.static('public'));

// Export the Express app
module.exports = app;