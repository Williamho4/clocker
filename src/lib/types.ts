import { Shift } from '@prisma/client'

export type signUpPayload = {
  email: string
  name: string
  password: string
}

export type Weekday = {
  date: Date
  label: string
  dayName: string
  iso: string
}
