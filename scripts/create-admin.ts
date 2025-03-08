// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function main() {
  // Use the DATABASE_URL from environment variables
  const uri = "mongodb://root:7npHdkwqXBEDXvoDDu46WXLY@sabalan.liara.cloud:31578/my-app?authSource=admin";
  
  if (!uri) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout
    family: 4, // Use IPv4, skip trying IPv6
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const usersCollection = database.collection('User');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@mirza.agency' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('h^sD1w$b9C&8SD34', 10);
    
    const admin = await usersCollection.insertOne({
      email: 'admin@mirza.agency',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin user created successfully:', 'admin@mirza.agency');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main(); 