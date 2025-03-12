/**
 * Database validation script
 * 
 * This script connects to the database and validates that the schemas match
 * what our models expect. It can be run to debug connection or schema issues.
 */

import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';
import { availableAppointmentModel } from '../lib/models/availableAppointment';
import { bookingModel } from '../lib/models/booking';

async function validateDatabase() {
  console.log('Starting database validation...');
  
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
    
    // Check connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`MongoDB not connected. Current state: ${mongoose.connection.readyState}`);
    }
    
    // Get all collection names
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(` - ${collection.collectionName}`);
    });
    
    // Check appointment collection
    console.log('\nChecking availableAppointment collection...');
    const appointmentSample = await availableAppointmentModel.model.findOne().lean();
    if (appointmentSample) {
      console.log('Found sample appointment:');
      console.log(JSON.stringify(appointmentSample, null, 2));
      console.log(`ID type: ${typeof appointmentSample._id}`);
      console.log(`ID value: ${appointmentSample._id}`);
      console.log(`ID toString: ${appointmentSample._id.toString()}`);
    } else {
      console.log('No appointments found in database');
    }
    
    // Check booking collection
    console.log('\nChecking booking collection...');
    const bookingSample = await bookingModel.model.findOne().lean();
    if (bookingSample) {
      console.log('Found sample booking:');
      console.log(JSON.stringify(bookingSample, null, 2));
    } else {
      console.log('No bookings found in database');
    }
    
    // Test findUnique with a string ID
    if (appointmentSample) {
      const stringId = appointmentSample._id.toString();
      console.log(`\nTesting findUnique with string ID: ${stringId}`);
      const foundById = await availableAppointmentModel.findUnique({
        where: { id: stringId }
      });
      console.log('Result:', foundById ? 'Found' : 'Not found');
      if (foundById) {
        console.log(`Found ID: ${foundById.id}`);
      }
    }
    
    console.log('\nDatabase validation completed successfully');
  } catch (error) {
    console.error('Database validation failed:', error);
  } finally {
    // Close connection
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
    process.exit(0);
  }
}

// Run the validation
validateDatabase(); 