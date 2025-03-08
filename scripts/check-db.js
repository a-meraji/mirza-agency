// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function main() {
  // Use the DATABASE_URL from environment variables
  const uri = process.env.DATABASE_URL || "mongodb://root:7npHdkwqXBEDXvoDDu46WXLY@sabalan.liara.cloud:31578/my-app?authSource=admin";
  
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    
    // List all collections
    const collections = await database.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check User collection (uppercase)
    try {
      const userCollection = database.collection('User');
      const users = await userCollection.find({}).toArray();
      console.log(`\nFound ${users.length} users in 'User' collection:`);
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    } catch (err) {
      console.log("Error checking User collection:", err.message);
    }
    
    // Check users collection (lowercase)
    try {
      const usersCollection = database.collection('users');
      const users = await usersCollection.find({}).toArray();
      console.log(`\nFound ${users.length} users in 'users' collection:`);
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    } catch (err) {
      console.log("Error checking users collection:", err.message);
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main(); 