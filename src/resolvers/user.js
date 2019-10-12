import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userID on User { id }',
    resolve(parent, args, {request}, info) {
      const userId = getUserId(request, false)
  
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  posts: {
    fragment: 'fragment userID on User { id }',
    resolve(parent, args, {prisma}, info) {
  
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      }, info)
    }
  }
}

export { User as default }