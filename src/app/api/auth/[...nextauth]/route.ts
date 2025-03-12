import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { db } from "@/lib/models";
import { DatabaseService } from "@/lib/services/database";

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

// Extend the JWT type to include the role property
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Find user by email using our new model
          const user = await DatabaseService.executeWithRetry(async () => {
            return await db.user.findByEmail(credentials.email);
          });

          if (!user) {
            console.log(`Login attempt failed: User not found for email ${credentials.email}`);
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log(`Login attempt failed: Invalid password for email ${credentials.email}`);
            return null;
          }

          console.log(`User authenticated successfully: ${user.email} (${user.role})`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login?error=true",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 