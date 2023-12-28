const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const database = client.db('management');
    const collection = database.collection('employees');

    const employees = await collection.find({}).toArray();
    if (!employees.length) {
      return res.status(404).send('No employees found');
    }

    return res.json(employees);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    return res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
};
