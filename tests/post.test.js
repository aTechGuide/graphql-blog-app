import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import seedBdatabase from './utils/seedDB';
import getClient from './utils/getClient';

const client = getClient()

beforeAll(seedBdatabase)

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