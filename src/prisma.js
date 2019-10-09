import {Prisma} from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {

//   const userExist = await prisma.exists.User({
//     id: authorId
//   })

//   if (!userExist) {
//     throw new Error(`User with ${authorId} doesn't exist`)
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{author { id name email posts {id title published } } }')

//   return post.author
// }

// Valid user: ck1gipp78004b0857a9t9zp3q
// createPostForUser('ck1gipp78004b0857a9t9zp3q', {
//   title: "Async Await 2",
//   body: "This is body",
//   published: true
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch((error) => {
//   console.log(error.message);
// })

// const updatePostForUser = async (postId, data) => {

//   const postExist = await prisma.exists.Post({
//     id: postId
//   })

//   if (!postExist) {
//     throw new Error(`Post with ${postId} doesn't exist`)
//   }

//   const post = await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data: {
//       ...data,
//     }
//   }, '{ author {id name email posts {id title published}}}')

//   return post.author
// }

//ck1gk2klo008q085763a6j2u1,
// ck1hath1r00a30857kk56ev51
// updatePostForUser('ck1hath1r00a30857kk56ev51', {title: 'Async Await Updated 2', published: false })
// .then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch((error) => {
//   console.log(error.message);
// })