// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fetch = require('node-fetch');

async function main() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mirza.agency',
        password: 'h^sD1w$b9C&8SD34',
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

main(); 