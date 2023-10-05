import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
// import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // const userr = userResponse.data

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        // primeiro objeto contém os dados quero no token. Por ser um token, ele é apenas assinado e n criptografado, por isso, não se coloca informações sensíveis
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        // necessário informar duas informações: "sub" e "expiresIn"
        // sub que é um diminutivo de 'subject', que contém a qual usuário o token pertence, logo passa-se uma informação que seja única, como o id
        sub: user.id,
        // o expiresIn determina quanto tempo o token irá durar antes de expirar
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
