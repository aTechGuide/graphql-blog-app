import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  if(password.length < 8) {
    throw new Error('Password Must be 8 char or longer')
  }

  // Salt is a random series of characters that are hashed along with string we are hashing
  return bcrypt.hash(password, 10)
}

export { hashPassword as default }