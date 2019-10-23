import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import seedBdatabase, {userOne} from './utils/seedDB';
import getClient from './utils/getClient';

const client = getClient()

beforeAll(seedBdatabase)

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

test('Should Fetch user Profile', async () => {

  const client = getClient(userOne.jwt)
  const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`
  const {data} = await client.query({query: getProfile})

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)

})