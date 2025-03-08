const { hash } = require('bcrypt');

async function hashPassword() {
  const password = 'h^sD1w$b9C&8SD34';
  const saltRounds = 10;
  
  try {
    const hashedPassword = await hash(password, saltRounds);
    console.log('Your hashed password:');
    console.log(hashedPassword);
    console.log('\nYou can now use this hash in MongoDB Compass.');
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

hashPassword(); 