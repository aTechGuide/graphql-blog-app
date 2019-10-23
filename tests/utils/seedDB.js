import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userOne = {
  input: {
    name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('Red095345!')
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: 'Test Post 1',
    body: 'Test Published Post 1 Body',
    published: true,
  },
  post: undefined
}

const postTwo = {
  input: {
    title: 'Test Post 2',
    body: 'Draft Post 2 Body',
    published: false,
  },
  post: undefined
}

const seedBdatabase = async () => {

  jest.setTimeout(100000);

  // Delete Test Data
  await prisma.mutation.deleteManyUsers()
  await prisma.mutation.deleteManyPosts()

  // Create UserOne
  // we need to hash password already as node hashes our password. As we are bypassing node so we need to hash password
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })

    userOne.jwt = jwt.sign({userId: userOne.user.id }, process.env.JWT_SECRET)


  // create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  // create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

export { seedBdatabase as default, userOne, postOne, postTwo}