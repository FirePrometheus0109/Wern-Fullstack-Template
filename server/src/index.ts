import 'reflect-metadata'
import 'dotenv-safe/config'
import express from 'express'
// import path from 'path'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { __prod__ } from './config'
import { HelloResolver } from './resolvers/hello'
import { User } from './entities/User'

const main = async () => {
  console.log(process.env.DATABASE_URL)
  /*const conn =*/ await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    //migrations: [path.join(__dirname, './migrations/*')],
    entities: [User],
  })

  const app = express()

  app.set('trust proxy', 1)
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: '/',
  })

  app.listen(parseInt(process.env.PORT!), () => {
    console.log(`server started on localhost:${process.env.PORT!}`)
  })
}

main().catch((err) => {
  console.error(err)
})
