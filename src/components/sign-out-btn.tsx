'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function SignOutBtn() {
  const router = useRouter()

  const handleClick = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/sign-in')
        },
      },
    })
  }

  return <Button onClick={handleClick}>Sign Out</Button>
}
