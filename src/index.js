import {GraphQLServer} from 'graphql-yoga';

import db from './db';
import Query from './resolvers/query';
import Mutation from './resolvers/mutation';
import User from './resolvers/user';
import Post from './resolvers/post';
import Comment from './resolvers/comment';

// Resolver
const resolvers = {
  
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // Path relative to root of application
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  context: {
    db
  }
})

server.start(() => {
  console.log('Server is running');
})