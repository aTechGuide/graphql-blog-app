import 'cross-fetch/polyfill';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

beforeAll( async () => {
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
})

test('Should create a new User', async () => {

  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Kamran",
          email: "kamran@example.com",
          password: "MyPass123"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `

  const response = await client.mutate({
    mutation: createUser
  })

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })

  expect(exists).toBe(true)

})

test('Should expose public author profile', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `

  const response = await client.query({
    query: getUsers
  })

  const users = response.data.users
  expect(users.length).toBe(2)
  expect(users[0].email).toBe(null)
  expect(users[0].name).toBe('Jen')

})

test('Should expose public posts', async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `

  const response = await client.query({
    query: getPosts
  })

  const posts = response.data.posts
  expect(posts.length).toBe(1)
  expect(posts[0].title).toBe('Test Post 1')
  expect(posts[0].body).toBe('Test Published Post 1 Body')
  expect(posts[0].published).toBe(true)

})

test('should not login with bad credentials', async () => {

  const login = gql`
    mutation {
      login(
        data: {
          email: "jeff@example.com",
          password: ""
        }
      )
      {
        token
      }
    }
  `

  await expect(client.mutate({
    mutation: login
  })).rejects.toThrow()
  
})

test('Should NOT sign up user with invalid password', async () => {

  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "sarah",
          email: "sarah@example.com",
          password: "123"
        }
      ) {
        token
      }
    }
  `

  await expect(client.mutate({
    mutation: createUser
  })).rejects.toThrow()

})