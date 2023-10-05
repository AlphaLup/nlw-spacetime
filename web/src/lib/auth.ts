import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUser() {
  // pega o token disponível nos cookies, sendo o ? uma sinalização para o possível valor undefined
  const token = cookies().get('token')?.value

  //   caso seja undefined, dispara o erro 'Unauthenticated'
  if (!token) {
    throw new Error('Unauthenticated.')
  }

  //   usa a biblioteca jwt-decode para decodificar as informações contidas no token
  const user: User = decode(token)

  return user
}
