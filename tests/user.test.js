import 'cross-fetch/polyfill';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

beforeEach( async () => {
  jest.setTimeout(10000);
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