import {GraphQLServer, PubSub} from 'graphql-yoga';

import db from './db';
import {resolvers, fragmentReplacements} from './resolvers/index';
import prisma from './prisma';

const pubsub = new PubSub()
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to root of application
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
})

export {server as default}