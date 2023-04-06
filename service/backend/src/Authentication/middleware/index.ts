import { keypair } from '@config/authentication';
import base64url from 'base64url';
import { FastifyReply, FastifyRequest } from 'fastify';

export type AuthData = {
  auth: false | {
    method: string;
  };
};

export const detectAuthentication = async (req: FastifyRequest, res: FastifyReply, next: ()=>void) => {
  Object.defineProperty(req, 'auth', { value: false, enumerable: true, writable: true });

  try {

    // Fetch the token
    const authHeader            = req.headers.authorization || '';
    const [authType, authToken] = authHeader.split(' ');
    if (authType.toLowerCase() !== 'bearer') return next();

    // Check token structure
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) return next();

    // Decode the data in there (may throw, 'tis the reason for the try-catch)
    const tokenHeader    = JSON.parse(base64url.decode(tokenParts[0]));
    const tokenBody      = JSON.parse(base64url.decode(tokenParts[1]));
    const tokenSignature = base64url.toBuffer(tokenParts[2]);

    // Sanity checking
    if (!(tokenHeader && tokenBody && tokenSignature)) return next();
    if ('object' !== typeof tokenHeader) return next();
    if ('object' !== typeof tokenBody  ) return next();

    // Verify we support this token type
    if (!(tokenHeader.alg && tokenHeader.typ)) return next();
    if (tokenHeader.typ !== 'JWTISH') return next();
    if (tokenHeader.alg !== 'ED25519') return next();

    // @ts-ignore The `supercop` library isn't typed (yet)
    const signatureValid = await (await keypair).verify(tokenSignature, [tokenParts[0],tokenParts[1]].join('.'));
    if (!signatureValid) return next();

    // Here = authenticated

    Object.defineProperty(req, 'auth', {
      enumerable: true,
      writable: true,
      value: {
        method: 'jwtish',
        token : {
          header: tokenHeader,
          body  : tokenBody,
        },
      }
    });

    next();
  } catch {
    Object.defineProperty(req, 'auth', { value: false, enumerable: true, writable: true });
    return next();
  }

};
