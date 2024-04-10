import { Adapter } from 'next-auth/adapters'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

import { prisma } from '../prisma'

interface User {
  id: string
  name: string
  email: string | null
  username: string
  avatar_url: string | null
  created_at: Date
}

export default function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  function destructureUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email!,
      username: user.username,
      avatar_url: user.avatar_url!,
      created_at: user.created_at.toISOString(),

      emailVerified: null,
    }
  }

  return {
    // @ts-expect-error
    async createUser(user) {
      const { '@ignitecall:userId': userId } = parseCookies({ req })

      if (!userId) {
        return new Error('User ID not found in cookies')
      }

      const newUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', { path: '/' })

      return destructureUser(newUser)
    },

    // @ts-expect-error
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return null
      }

      return destructureUser(user)
    },

    // @ts-expect-error
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return null
      }

      return destructureUser(user)
    },

    // @ts-expect-error
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      return destructureUser(account.user)
    },

    // @ts-expect-error
    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return destructureUser(updatedUser)
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          session_token: sessionToken,
          expires,
        },
      })

      return {
        sessionToken,
        userId,
        expires,
      }
    },

    // @ts-expect-error
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!session) {
        return null
      }

      return {
        user: destructureUser(session.user),
        session: {
          userId: session.user_id,
          sessionToken: session.session_token,
          expires: session.expires,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          user_id: userId,
          expires,
        },
      })

      return {
        sessionToken,
        userId: session.user_id,
        expires: session.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },

    // async createVerificationToken({ identifier, expires, token }) {},
    // async useVerificationToken({ identifier, token }) {},
    // async unlinkAccount({ providerAccountId, provider }) {},
    // async deleteUser(userId) {},
  }
}
