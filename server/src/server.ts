import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

const app = fastify()

app.register(jwt, {
  secret: 'spacetime',
})

app.register(cors, {
  origin: true, // -> todas as URLs de front-end poderão acessar o back-end, não é recomendado
  // origin: ['http://localhost:3000'], // especifica quais URLs poderão acessar
})

app.register(memoriesRoutes)
app.register(authRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
