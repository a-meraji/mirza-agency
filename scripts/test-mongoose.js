// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

// Define the schema with explicit collection name
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, required: true, default: 'user' },
  },
  {
    timestamps: true,
    collection: 'User', // Explicitly set the collection name
  }
);

// Create the model
const User = mongoose.model('User', userSchema);

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Find user by email using Mongoose model
    console.log('\nLooking for admin@mirza.agency using Mongoose model...');
    const user = await User.findOne({ email: 'admin@mirza.agency' }).lean();
    
    if (user) {
      console.log('User found with Mongoose:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User not found with Mongoose model');
      
      // Try direct MongoDB query
      console.log('\nTrying direct MongoDB query...');
      const directUser = await mongoose.connection.db.collection('User').findOne({ email: 'admin@mirza.agency' });
      
      if (directUser) {
        console.log('User found with direct query:');
        console.log(JSON.stringify(directUser, null, 2));
      } else {
        console.log('User not found with direct query either');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

main(); 