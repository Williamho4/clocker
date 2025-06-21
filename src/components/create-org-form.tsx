'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Card } from './ui/card'

export default function CreateOrgForm() {
  const handleCreate = async (formData: FormData) => {
    const name = formData.get('organization') as string

    if (!name) {
      return console.error('Not valid name')
    }

    await authClient.organization.create({
      name,
      slug: name,
    })

    window.location.reload()
  }

  return (
    <Card className="p-5 w-100 space-y-4">
      <form action={handleCreate} className="space-y-4">
        <Label htmlFor="organization">Organization Name</Label>
        <Input id="organization" name="organization"></Input>

        <Button type="submit">Create</Button>
      </form>
    </Card>
  )
}
