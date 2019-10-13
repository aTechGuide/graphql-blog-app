# graphql-sandbox
This app provides following functionality

- Allows clients to SignUp and SignIn
- Allows authenticated clients to Fetch their profile
- Allows authenticated clients to create, update and delete their post
- Allows client to fetch all the `published` posts and authenticated users to fetch all of their posts
- Allows clients to comment on a post
- Pagination Support
- Sorting Support

# Hosting
Hosted via Prisma Cloud and Heroku

# Tech Stack
- GraphQL (using graphql-yoga)
- Prisma 
- Prisma Cloud
- JWT

# Commands
## Deployment 
- Test: `prisma deploy -e ../config/dev.env`
- Prod: `prisma deploy -e ../config/prod.env`


