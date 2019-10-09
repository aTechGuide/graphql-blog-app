import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {

    const emailTaken = await prisma.exists.User({ email: args.data.email })
    
    if(emailTaken) {
      throw new Error('Email Taken')
    }

    return prisma.mutation.createUser({ data: args.data }, info)
  },
  async deleteUser(parent, args, {prisma}, info) {

    const userExists = await prisma.exists.User({ id: args.id })
    if(!userExists) {
      throw new Error('User NOT Found')
    }

    return prisma.mutation.deleteUser({
      where : {
        id : args.id
      }
    }, info)
  },
  async updateUser(parent, args, {prisma}, info)  {

    return prisma.mutation.updateUser({
      where: {
        id : args.id
      },
      data: args.data
    }, info)
  },
  createPost(parent, args, {db, pubsub}, info) {
    const userExist = db.users.some((user) => user.id === args.data.author)

    if(!userExist) {
      throw new Error('User NOT Found')
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    db.posts.push(post)

    if (args.data.published) {
      pubsub.publish('post', { 
        post : {
          mutation: 'CREATED',
          data: post
        }
      })
    }
    return post
  },
  deletePost(parent, args, {db, pubsub}, info) {

    const postIndex = db.posts.findIndex((post) => post.id === args.id)

    if(postIndex === -1) {
      throw new Error('Post NOT Found')
    }

    const [post] = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    if (post.published) {
      pubsub.publish('post', { 
        post : {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post
  },
  updatePost(parent, args, {db, pubsub}, info) {

    const {id, data} = args
    const post = db.posts.find((post) => post.id === id)
    const originalPost = { ...post}

    if(!post) {
      throw new Error('Post NOT Found')
    }

    if (typeof data.title ===  'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        pubsub.publish('post', { 
          post : {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', { 
          post : {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', { 
        post : {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
    
  },
  createComment(parent, args, {db, pubsub}, info) {
    const userExist = db.users.some((user) => user.id === args.data.author)
    const postExist = db.posts.some((post) => post.id === args.data.post && post.published)

    if(!userExist || !postExist) {
      throw new Error('Unable to find user and post')
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment)
    
    pubsub.publish(`comment ${args.data.post}`, { 
      comment : {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },
  deleteComment(parent, args, {db, pubsub}, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

    if(commentIndex === -1) {
      throw new Error('Comment NOT Found')
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${deletedComment.post}`, { 
      comment : {
        mutation: 'DELETED',
        data: deletedComment
      }
    })

    return deletedComment
  },
  updateComment(parent, args, {db, pubsub}, info) {
    const {id, data} = args

    const comment = db.comments.find((comment) => comment.id === id)

    if(!comment) {
      throw new Error('Comment NOT Found')
    }
 
    if (typeof data.text ===  'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment ${comment.post}`, { 
      comment : {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  }
}

export {Mutation as default }