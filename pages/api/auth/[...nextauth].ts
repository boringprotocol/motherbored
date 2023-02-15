import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "../../../utils/SigninMessage";
import { SiweMessage } from "siwe";

type CustomSession = Session & {
  publicKey?: string;
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
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
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!process.env.NEXTAUTH_URL) {
            throw "NEXTAUTH_URL is not set";
          }
          // the siwe message follows a predictable format
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          if (siwe.domain !== nextAuthUrl.host) {
            return null;
          }
          // validate the nonce
          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }
          // siwe will validate that the message is signed by the address
          await siwe.validate(credentials?.signature || "");
          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hides Sign-In with Solana from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        const customSession: CustomSession = {
          ...session,
          publicKey: token.sub,
        };

        if (customSession.user) {
          customSession.user.name = token.sub;
        }

        return customSession;
      },
    },
  } as AuthOptions);
}
