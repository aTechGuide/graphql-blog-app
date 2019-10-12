import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {

    if(args.data.password.length < 8) {
      throw new Error('Password Must be 8 char or longer')
    }

    // Salt is a random series of characters that are hashed along with string we are hashing
    const password = await bcrypt.hash(args.data.password, 10)

    // It decodes token + Verify that token is created with a specifc secret
    // In short verify makes sure that tokens we are reading are tokens created by us
    jwt.verify

    // Without info we only receive scalar values
    const user = await prisma.mutation.createUser({ 
        data: {
          ...args.data,
          password
        } 
      })
    
    return {
      user,
      token: generateToken(user.id)
    }
  },
  async login(parent, args, {prisma}, info) {

    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })

    if(!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if(!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async deleteUser(parent, args, {prisma, request}, info) {

    const userId = getUserId(request)

    return prisma.mutation.deleteUser({
      where : {
        id : userId
      }
    }, info)
  },
  async updateUser(parent, args, {prisma, request}, info)  {

    const userId = getUserId(request)

    return prisma.mutation.updateUser({
      where: {
        id : userId
      },
      data: args.data
    }, info)
  },
  createPost(parent, args, {prisma, request}, info) {

    const userId = getUserId(request)

    return prisma.mutation.createPost({
       data: {
         title: args.data.title,
         body: args.data.body,
         published: args.data.published,
         author: {
           connect: {
             id: userId
           }
         }
       } 
      }, info)
  },
  async deletePost(parent, args, {prisma, request}, info) {

    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!postExists) {
      throw new Error('Unable to delete post')
    }

    return prisma.mutation.deletePost({
      where : {
        id : args.id
      }
    }, info)
  },
  async updatePost(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!postExists) {
      throw new Error('Unable to update post')
    }

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updatePost({
      where: {
        id : args.id
      },
      data: args.data
    }, info)
  },
  async createComment(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })

    if(!postExists) {
      throw new Error('Unable to find post')
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      } 
     }, info)
  },
  async updateComment(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!commentExists) {
      throw new Error('Unable to update comment')
    }

    return prisma.mutation.updateComment({
      where: {
        id : args.id
      },
      data: args.data
    }, info)
  },
  async deleteComment(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!commentExists) {
      throw new Error('Unable to delete comment')
    }

    return prisma.mutation.deleteComment({
      where : {
        id : args.id
      }
    }, info)
  }
}

export {Mutation as default }