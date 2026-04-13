import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus, Role } from "@/lib/enums";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      username: string;
      display_name: string;
      avatar: string;
      status: UserStatus;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    username: string;
    display_name: string;
    avatar: string;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    username: string;
    display_name: string;
    avatar: string;
    status: UserStatus;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        await connectToDatabase();
        
        const username = (credentials?.username as string).trim();
        const password = (credentials?.password as string).trim();

        const user = await User.findOne({ username }).lean();

        if (!user) return null;
        if (user.status === UserStatus.BANNED) throw new Error("BANNED_USER");

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.display_name,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser?.status === UserStatus.BANNED) return "/login?error=Banned";

      if (account?.provider === "google") {
        if (!existingUser) {
          let baseUsername = user.email?.split("@")[0] || "user";
          let newUsername = baseUsername;
          
          while (await User.findOne({ username: newUsername })) {
            newUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
          }

          await User.create({
            email: user.email,
            display_name: user.name || baseUsername,
            username: newUsername,
            avatar: user.image,
            password_hash: "GOOGLE_OAUTH_NO_PASSWORD",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email }).lean();
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role ?? Role.MEMBER;
            token.username = dbUser.username;
            token.status = dbUser.status;
          }
        } else {
          token.id = user.id;
          token.role = user.role;
          token.username = user.username;
          token.status = user.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});
