'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { startOfWeek, endOfWeek } from 'date-fns'

export default function FormTime() {
  const handleSubmit = (formData: FormData) => {
    const authData = Object.fromEntries(formData.entries())

    const dateStr = authData.date as string
    const startTime = authData.startTime as string
    const endTime = authData.endTime as string

    const date = new Date(dateStr)

    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

    console.log('Selected date:', date)
    console.log('Week start:', weekStart)
    console.log('Week end:', weekEnd)
    console.log({ startTime, endTime })
  }

  return (
    <form action={handleSubmit}>
      <Input type="date" name="date" required />
      <Input type="time" name="startTime" required />
      <Input type="time" name="endTime" required />
      <Button type="submit">Submit</Button>
    </form>
  )
}
