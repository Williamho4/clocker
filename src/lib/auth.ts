import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './db'
import { nextCookies } from 'better-auth/next-js'
import { organization } from 'better-auth/plugins'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        input: false,
      },
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
    },
  },
  organization: {
    members: {
      additionalFields: {
        role: {
          type: ['member', 'admin', 'owner'], // <-- NOT just 'string'
        },
        user: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [nextCookies(), organization()],
})

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN'
