import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {

  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if(header) {
    const token = header.replace('Bearer ', '')

    // It decodes token + Verify that token is created with a specifc secret
    // In short verify makes sure that tokens we are reading are tokens created by us
    const decoded = jwt.verify(token, 'thisisasecret')
    return decoded.userId   
  }

  if(requireAuth) {
    throw new Error('Authentication Required')
  }

  return null
}

export { getUserId as default }