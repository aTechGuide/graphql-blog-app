import {GraphQLServer} from 'graphql-yoga';

const users = [{
  id: '1',
  name: 'Kamran',
  email: 'sf@fsd'
}, {
  id: '2',
  name: 'Sarah',
  email: 'sf@fsd'
}, {
  id: '3',
  name: 'Mike',
  email: 'sf@fsd'
}
]

const posts = [{
  id: '10',
  title: 'title1',
  body: 'body1',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'title2',
  body: 'body2',
  published: true,
  author: '1'
}, {
  id: '12',
  title: 'title3',
  body: 'body3',
  published: true,
  author: '2'
}
]

const comments = [{
  id: '102',
  text: 'text2',
  author: '3',
  post: '10'
}, {
  id: '103',
  text: 'text3',
  author: '1',
  post: '10'
}, {
  id: '104',
  text: 'text4',
  author: '2',
  post: '11'
}, {
  id: '105',
  text: 'text5',
  author: '1',
  post: '11'
}]

// Type Definitions (Schema)

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolver
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {

      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {

      if (!args.query) {
        return posts
      }

      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    me() {
      return {
          id: '12sw',
          name: 'Mike',
          email: 'afd@fd',
          age: 20
      }
    },
    post() {
      return {
          id: '12sw',
          title: 'Title',
          body: 'afd@ fs fsdfds fd',
          published: true
      }
    },
    comments() {
      return comments
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
      }) 
    },
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('Server is running');
})