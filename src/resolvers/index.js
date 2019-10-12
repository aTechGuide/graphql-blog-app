import { extractFragmentReplacements } from 'prisma-binding';
import Query from './query';
import Mutation from './mutation';
import User from './user';
import Post from './post';
import Comment from './comment';
import Subscription from './subscription';

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }