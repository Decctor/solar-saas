import NextAuth from 'next-auth'
import { Comissao } from './models'
import { TSessionUser, TUser } from './schemas/user.schema'
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: TSessionUser
  }
}
