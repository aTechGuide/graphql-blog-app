# Graphql Blog App
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

# Links
- Production Instance [Link](https://fierce-castle-27103.herokuapp.com/)
- Local Instance [Link](http://localhost:4000)

# Tech Stack
- GraphQL (using graphql-yoga)
- Prisma 
- Prisma Cloud
- JWT

# Getting Started
- Launch Prisma and database
  - Create a `.env` file under `prisma` folder with following environment variables
  ```
    POSTGRES_HOST=<postgres-hostname>
    POSTGRES_DATABASE=<postgres-database>
    POSTGRES_USER=<postgres-user>
    POSTGRES_PASSWORD=<postgres-password>
  ```
  - `cd prisma`
  - Starting Container: `docker-compose up -d`
  - Stopping Services: `docker-compose stop`
  - Killing Container: `docker-compose kill`
  - Removing Stopped Containers: `docker-compose rm`
  - 

- Deploy the prisma Datamodel. From inside `prisma` folder run
  - Dev: `prisma deploy -e ../config/dev.env`
  - Test: `prisma deploy -e ../config/test.env`
  - Prod: `prisma deploy -e ../config/prod.env`

- Install the node dependencies
  - `npm install`

- Generate the Schema Dependencies
  - Run `npm run get-schema`

- Run the App
  - DEV: `npm run dev`
  - TEST: `npm run test`

# Reference
- This project was built as a part of [The Modern GraphQL Bootcamp (with Node.js and Apollo)](https://www.udemy.com/course/graphql-bootcamp/) Udemy course by Andrew Mead


