const Query = {
  users(parent, args, {prisma}, info) {

    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }, {
          email_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  posts(parent, args, {prisma}, info) {

    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }

    return prisma.query.posts(null, info)
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
  comments(parent, args, {db}, info) {
    return db.comments
  }
}

export {Query as default}