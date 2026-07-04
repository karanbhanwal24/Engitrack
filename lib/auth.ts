import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

function getUrlValidationError() {
  const authUrl = process.env.NEXTAUTH_URL?.trim();

  if (!authUrl) {
    return null;
  }

  if (authUrl.includes(",")) {
    return "NEXTAUTH_URL must be a single URL. Remove comma-separated values and configure Preview/Production separately in Vercel.";
  }

  try {
    const parsed = new URL(authUrl);

    if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
      const previewHost = process.env.VERCEL_URL.replace(/^https?:\/\//, "");

      if (parsed.host !== previewHost) {
        return "NEXTAUTH_URL points at a different host than this Vercel preview deployment. Remove NEXTAUTH_URL from Preview or set it to the preview URL.";
      }
    }
  } catch {
    return "NEXTAUTH_URL is not a valid absolute URL.";
  }

  return null;
}

export function getAuthConfigError() {
  if (!process.env.NEXTAUTH_SECRET?.trim()) {
    return "Missing NEXTAUTH_SECRET environment variable.";
  }

  return getUrlValidationError();
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password.");
        }

        await connectToDatabase();
        const user = (await User.findOne({ email: credentials.email.toLowerCase().trim() }).lean()) as AuthUser | null;

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

export async function authSafe(): Promise<{ session: Session | null; error: string | null }> {
  const configError = getAuthConfigError();

  if (configError) {
    return {
      session: null,
      error: configError,
    };
  }

  try {
    return {
      session: await getServerSession(authOptions),
      error: null,
    };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error.message : "Failed to initialize authentication.",
    };
  }
}
