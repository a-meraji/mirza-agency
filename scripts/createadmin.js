// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { hash } = require('bcrypt');

async function main() {
  const uri = "mongodb://root:7npHdkwqXBEDXvoDDu46WXLY@sabalan.liara.cloud:31578/my-app?authSource=admin";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const usersCollection = database.collection('User');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@mirza.agency' });

    if (existingAdmin) {
        console.log(existingAdmin)
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hash('h^sD1w$b9C&8SD34', 10);
    
    const admin = await usersCollection.insertOne({
      email: 'admin@mirza.agency',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully:', 'admin@mirza.agency');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main(); 