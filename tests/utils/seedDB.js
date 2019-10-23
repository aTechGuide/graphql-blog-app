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

const userTwo = {
  input: {
    name: 'Jeff',
      email: 'jeff@example.com',
      password: bcrypt.hashSync('PassForJeff')
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

const commentOne = {
  input: {
    text: "Geat post, Thanks for sharing!"
  },
  comment: undefined
}

const commentTwo = {
  input: {
    text: "I am glad you enjoyed it."
  },
  comment: undefined
}

const seeddatabase = async () => {

  jest.setTimeout(100000);

  // Delete Test Data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyUsers()
  await prisma.mutation.deleteManyPosts()

  // Create UserOne
  // we need to hash password already as node hashes our password. As we are bypassing node so we need to hash password
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })

  userOne.jwt = jwt.sign({userId: userOne.user.id }, process.env.JWT_SECRET)

  // Create UserTwo
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })

  userTwo.jwt = jwt.sign({userId: userTwo.user.id }, process.env.JWT_SECRET)


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

  // create comment one
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  })

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  })
}

export { seeddatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo}