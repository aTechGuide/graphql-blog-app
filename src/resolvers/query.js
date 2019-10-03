const Query = {
  users(parent, args, {db}, info) {

    if (!args.query) {
      return db.users
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
  },
  posts(parent, args, {db}, info) {

    if (!args.query) {
      return db.posts
    }

    return db.posts.filter((post) => {
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
  comments(parent, args, {db}, info) {
    return db.comments
  }
}

export {Query as default}