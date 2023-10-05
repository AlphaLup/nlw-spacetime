import { getUser } from '@/lib/auth'
import Image from 'next/image'

export function Profile() {
  // executa a função getUser de lib/auth.ts
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      {/* Profile image */}
      {/* por ser uma imagem externa, é necessário passar a altura e a largura que deseja-se carregar a imagem */}
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
      />

      {/* Profile text */}
      <p className=" max-w-[140px] text-sm leading-snug">
        {name}
        <a href="" className="block text-red-400 hover:text-red-300">
          Quero sair!
        </a>
      </p>
    </div>
  )
}
