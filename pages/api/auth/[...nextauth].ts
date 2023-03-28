import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "../../../utils/SigninMessage";
import prisma from "../../../lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log("Starting auth function");
  const providers = [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        console.log("Authorizing credentials:", credentials);
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            console.log("Invalid domain");
            return null;
          }

          if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
            console.log("Invalid nonce");
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult) {
            console.log("Validation failed");
            throw new Error("Could not validate the signed message");
          }

          console.log("Validation successful");

          let user = await prisma.user.findUnique({
            where: {
              wallet: signinMessage.publicKey,
            },
            select: {
              id: true,
              role: true,
            },
          });

          if (!user) {
            console.log("User not found, creating new user");
            user = await prisma.user.create({
              data: {
                wallet: signinMessage.publicKey,
                role: "n3wb", // make everyone a n3wb
              },
              select: {
                id: true,
                role: true,
              },
            });
          }

          return {
            id: signinMessage.publicKey,
            role: user.role, // assign role from the database
          };
        } catch (e) {
          console.error("Error occurred during authorization:", e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hides Sign-In with Solana from default sign page
  if (isDefaultSigninPage) {
    console.log("Hiding Sign-In with Solana from default sign page");
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    adapter: PrismaAdapter(prisma), // Add the Prisma adapter
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, user }: { token: any; user: any }) {
        console.log("JWT callback");
        if (user) {
          console.log("Adding user info to token");
          token.sub = user.id;
          token.role = user.role; // Add this line
        }
        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        console.log("Session callback");
        session.publicKey = token.sub;
        if (session.user) {
          console.log("Adding user info to session");
          session.user.name = token.sub;
          session.user.role = token.role; // Add this line
          // Remove email and image properties from the session object
          delete session.user.email;
          delete session.user.image;
          console.log("session.user", session.user);
        }

        return session;
      },
    },
  });
}
