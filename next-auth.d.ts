import { NextApiRequest, NextApiResponse } from "next";

declare module "next-auth" {
  function NextAuth(
    req: NextApiRequest,
    res: NextApiResponse,
    options: {
      providers: any[];
      adapter?: any;
      session?: any;
      secret?: string;
      jwt?: {
        secret?: string;
        encryption?: boolean;
        signingKey?: string;
        encryptionKey?: string;
        maxAge?: number;
        callbackUrl?: string;
        encode?(
          token: object,
          secret: string,
          options?: object
        ): Promise<string>;
        decode?(
          token: string,
          secret: string,
          options?: object
        ): Promise<object | string>;
        sign?(token: object, secret: string, options?: object): Promise<string>;
        verify?(
          token: string,
          secret: string,
          options?: object
        ): Promise<object | string>;
      };
      pages?: any;
      events?: any;
      debug?: boolean;
      logger?: any;
      callbacks?: any;
    }
  ): Promise<void>;
}

export default NextAuth;
