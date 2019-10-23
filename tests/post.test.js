import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seeddatabase, {userOne, postOne, postTwo} from './utils/seedDB';
import getClient from './utils/getClient';
import {getPosts, myPosts, updatePost, createPost, deletePost} from './utils/operations';

const client = getClient()

beforeAll(seeddatabase)

test('Should expose public posts', async () => {

  const response = await client.query({
    query: getPosts
  })

  const posts = response.data.posts
  expect(posts.length).toBe(1)
  expect(posts[0].title).toBe('Test Post 1')
  expect(posts[0].body).toBe('Test Published Post 1 Body')
  expect(posts[0].published).toBe(true)

})

test('Should fetch users posts', async () => {

  const client = getClient(userOne.jwt)

  const {data} = await client.query({
    query: myPosts
  })

  const posts = data.myPosts
  expect(posts.length).toBe(2)

})

test('Should be able to update own posts', async () => {

  const client = getClient(userOne.jwt)
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: updatePost, variables })
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false})

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)

})

test('Should be able to create new post', async () => {

  const client = getClient(userOne.jwt)
  const variables = {
    data: {
      title: "A test post",
      body: "",
      published: true
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables })

  expect(data.createPost.title).toBe("A test post")
  expect(data.createPost.body).toBe("")
  expect(data.createPost.published).toBe(true)
})

test('Should be able to delete post', async () => {

  const client = getClient(userOne.jwt)
  const variables = {
    id: postTwo.post.id,
  }

  await client.mutate({ mutation: deletePost, variables })
  const exists = await prisma.exists.Post({ id: postTwo.post.id})
  expect(exists).toBe(false)

})