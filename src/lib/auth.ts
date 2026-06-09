import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import type { User } from "@/types/user"

const hasGoogleCredentials =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET

const providers = []

if (hasGoogleCredentials) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  )
} else {
  // Demo / mock credentials provider for portfolio demo
  providers.push(
    Credentials({
      id: "demo",
      name: "Demo",
      credentials: {
        name: { label: "Display Name", type: "text", placeholder: "Demo User" },
      },
      async authorize(credentials) {
        if (!credentials?.name) return null
        return {
          id: "demo-user-001",
          name: credentials.name as string,
          email: "demo@youtube-clone.local",
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.name as string)}`,
        }
      },
    }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // OAuth providers (Google) — use profile
      if (account && profile) {
        token.id = profile.sub ?? ""
        token.picture = profile.picture ?? ""
        token.name = profile.name ?? ""
        token.email = profile.email ?? ""
      }
      // Credentials provider (demo) — use user object from authorize()
      if (user && !account) {
        token.id = user.id ?? ""
        token.picture = user.image ?? ""
        token.name = user.name ?? ""
        token.email = user.email ?? ""
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? ""
        session.user.image = (token.picture as string) ?? session.user.image
        session.user.name = (token.name as string) ?? session.user.name
        session.user.email = (token.email as string) ?? session.user.email
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
})

export function mapSessionToUser(
  session: {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  } | null,
): User | null {
  if (!session?.user) return null
  return {
    id: session.user.id ?? "",
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    avatarUrl: session.user.image ?? "",
    subscribedChannelIds: [],
  }
}
