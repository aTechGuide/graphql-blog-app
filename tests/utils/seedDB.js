import prisma from '../../src/prisma';
import bcrypt from 'bcryptjs';

const seedBdatabase = async () => {
  jest.setTimeout(100000);
  await prisma.mutation.deleteManyUsers()
  await prisma.mutation.deleteManyPosts()

  // we need to hash password already as node hashes our password. As we are bypassing node so we need to hash password
  const user = await prisma.mutation.createUser({

    data: {
      name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('Red095345!')
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: 'Test Post 1',
      body: 'Test Published Post 1 Body',
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: 'Test Post 2',
      body: 'Draft Post 2 Body',
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })
}

export {seedBdatabase as default}