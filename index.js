const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Use middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string (replace with your actual MongoDB connection string)
const mongoUri = process.env.MONGODB_URI;

// Serve static files (like your HTML, CSS, and JS files)
app.use(express.static('public'));

// Connect to MongoDB
const client = new mongodb.MongoClient(mongoUri);

const database = client.db('management');
const collection = database.collection('employees');

// Read
app.get('/employees', async (req, res) => {
    try {
        const employees = await collection.find({}).toArray();
        if (!employees.length) {
            return res.status(404).send('No employees found');
        }
        res.json(employees);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Create
app.post('/addEmployee', async (req, res) => {
    // Get form values from the request body
    const { id, name, email, role, address, phone, salary } = req.body;

    // Create the document object
    const document = {
        id,
        name,
        email,
        role,
        address,
        phone,
        salary
    };

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        // Specify the database and collection
        const database = client.db('management');
        const collection = database.collection('employees');

        // Insert the document
        const result = await collection.insertOne(document);
        console.log(`Document inserted with _id: ${result.insertedId}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }

    // Send a response to the client
    res.send('Employee added successfully!');
});

// Route for editing an employee
app.put('/edit/:id', async (req, res) => {
    const employeeId = req.params.id;
    const updatedEmployee = req.body;

    try {
        const objectId = ObjectId.isValid(employeeId) ? new ObjectId(employeeId) : null;

        if (!objectId) {
            console.log('Invalid ObjectId:', employeeId);
            res.status(400).send('Invalid ObjectId');
            return;
        }

        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('management');
        const collection = database.collection('employees');

        const result = await collection.updateOne({ _id: objectId }, { $set: updatedEmployee });

        if (result.modifiedCount === 1) {
            console.log(`Document with _id ${employeeId} updated`);
            res.send('Employee updated successfully!');
        } else {
            console.log(`Document with _id ${employeeId} not found`);
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add this route to fetch a single employee by ID
app.get('/employees/:_id', async (req, res) => {
    const employeeId = req.params._id;

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Specify the database and collection
        const database = client.db('management');
        const collection = database.collection('employees');

        // Find the employee by ID
        const employee = await collection.findOne({ _id: new mongodb.ObjectId(employeeId) });

        // Send the employee data as JSON response
        res.json(employee);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add this route to handle the delete operation
app.delete('/delete/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('management');
        const collection = database.collection('employees');

        const result = await collection.deleteOne({ _id: new mongodb.ObjectId(employeeId) });

        if (result.deletedCount === 1) {
            console.log(`Document with _id ${employeeId} deleted`);
            res.send('Employee deleted successfully!');
        } else {
            console.log(`Document with _id ${employeeId} not found`);
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});