const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  const client = new MongoClient(mongoUri);

  const employeeId = req.params.id;

  try {
    const objectId = ObjectId.isValid(employeeId) ? new ObjectId(employeeId) : null;

    if (!objectId) {
      console.log('Invalid ObjectId:', employeeId);
      return res.status(400).send('Invalid ObjectId');
    }

    await client.connect();

    const database = client.db('management');
    const collection = database.collection('employees');

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      console.log(`Document with _id ${employeeId} deleted`);
      return res.send('Employee deleted successfully!');
    } else {
      console.log(`Document with _id ${employeeId} not found`);
      return res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
};