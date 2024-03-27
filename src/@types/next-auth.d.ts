import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
    created_at?: Date
  }

  interface Session {
    user: User
  }
}
