import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedBdatabase, {userOne} from './utils/seedDB';
import getClient from './utils/getClient';
import {createUser, login, getUsers, getProfile} from './utils/operations';

const client = getClient()

beforeAll(seedBdatabase)

test('Should create a new User', async () => {

  const variables = {
    data: {
      name: 'Andrew',
      email: 'andrew@example.com',
      password: 'MyPass123'
    }
  }

  const response = await client.mutate({
    mutation: createUser,
    variables
  })

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })

  expect(exists).toBe(true)

})

test('Should expose public author profile', async () => {

  const response = await client.query({
    query: getUsers
  })

  const users = response.data.users
  expect(users.length).toBe(2)
  expect(users[0].email).toBe(null)
  expect(users[0].name).toBe('Jen')

})

test('should not login with bad credentials', async () => {

  const variables = {
    data: {
      email: "jen@example.com",
      password: "red098!@#$"
    }
  }

  await expect(client.mutate({
    mutation: login,
    variables
  })).rejects.toThrow()
  
})

test('Should NOT sign up user with invalid password', async () => {

  const variables = {
    data: {
      name: "sarah",
      email: "sarah@example.com",
      password: "123"
    }
  }

  await expect(client.mutate({
    mutation: createUser,
    variables
  })).rejects.toThrow()

})

test('Should Fetch user Profile', async () => {

  const client = getClient(userOne.jwt)
  const {data} = await client.query({query: getProfile})

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)

})