const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const client = new MongoClient(mongoUri);

  const { id, name, email, role, address, phone, salary } = req.body;
  const document = { id, name, email, role, address, phone, salary };

  try {
    await client.connect();

    const database = client.db('management');
    const collection = database.collection('employees');

    const result = await collection.insertOne(document);
    console.log(`Document inserted with _id: ${result.insertedId}`);

    return res.send('Employee added successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
};