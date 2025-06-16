'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'

export default function CreateOrgForm() {
  const handleCreate = async () => {
    await authClient.organization.create({
      name: 'Mcdonalds',
      slug: 'Mcdonalds',
    })
  }

  return <Button onClick={handleCreate}>Create Organization</Button>
}
