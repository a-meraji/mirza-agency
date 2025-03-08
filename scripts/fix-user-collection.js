// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

async function main() {
  // Use the DATABASE_URL from environment variables
  const uri = process.env.DATABASE_URL;
  
  if (!uri) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }
  
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
    
    // Check User collection
    const userCollection = database.collection('User');
    const usersCollection = database.collection('users');
    
    // Check if admin exists in User collection
    const adminInUserColl = await userCollection.findOne({ email: 'admin@mirza.agency' });
    console.log('\nAdmin in User collection:', adminInUserColl ? 'Yes' : 'No');
    if (adminInUserColl) {
      console.log('Admin details in User collection:');
      console.log(adminInUserColl);
    }
    
    // Check if admin exists in users collection
    const adminInUsersColl = await usersCollection.findOne({ email: 'admin@mirza.agency' });
    console.log('\nAdmin in users collection:', adminInUsersColl ? 'Yes' : 'No');
    if (adminInUsersColl) {
      console.log('Admin details in users collection:');
      console.log(adminInUsersColl);
    }
    
    // If admin exists in User but not in users, copy it to users
    if (adminInUserColl && !adminInUsersColl) {
      console.log('\nCopying admin from User to users collection...');
      
      // Create a copy of the admin user for the users collection
      const adminForUsers = {
        ...adminInUserColl,
        _id: new ObjectId(), // Generate a new ID
        createdAt: adminInUserColl.createdAt || new Date(),
        updatedAt: adminInUserColl.updatedAt || new Date()
      };
      
      // Insert into users collection
      await usersCollection.insertOne(adminForUsers);
      console.log('Admin copied to users collection');
    }
    
    // If admin doesn't exist in either collection, create it in both
    if (!adminInUserColl && !adminInUsersColl) {
      console.log('\nCreating admin user in both collections...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('h^sD1w$b9C&8SD34', 10);
      
      // Create admin user object
      const adminUser = {
        email: 'admin@mirza.agency',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert into User collection
      await userCollection.insertOne(adminUser);
      console.log('Admin created in User collection');
      
      // Insert into users collection (with a new ID)
      const adminForUsers = {
        ...adminUser,
        _id: new ObjectId() // Generate a new ID
      };
      await usersCollection.insertOne(adminForUsers);
      console.log('Admin created in users collection');
    }
    
    // Verify the results
    console.log('\nVerifying results...');
    const finalAdminInUser = await userCollection.findOne({ email: 'admin@mirza.agency' });
    const finalAdminInUsers = await usersCollection.findOne({ email: 'admin@mirza.agency' });
    
    console.log('Admin in User collection:', finalAdminInUser ? 'Yes' : 'No');
    console.log('Admin in users collection:', finalAdminInUsers ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main(); 