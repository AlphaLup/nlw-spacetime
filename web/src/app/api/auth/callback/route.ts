import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url) // permite acessar os parametros passados na url
  const code = searchParams.get('code')

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  // redireciona para a página principal
  const redirectURL = new URL('/', request.url)

  // cálculo para 1 mês em segundos para a validade do cookie
  const cookieExpiresInSeconds = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectURL, {
    // define as informações a serem guardadas nos cookies
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
