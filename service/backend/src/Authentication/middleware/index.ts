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
    if ('object' !== typeof tokenHeader  ) return next();
    if ('object' !== typeof tokenBody    ) return next();
    if ('string' !== typeof tokenBody.sub) return next();
    if ('number' !== typeof tokenBody.iat) return next();
    if ('number' !== typeof tokenBody.exp) return next();

    // Verify we support this token type
    if (!(tokenHeader.alg && tokenHeader.typ)) return next();
    if (tokenHeader.typ !== 'JWTISH') return next();
    if (tokenHeader.alg !== 'ED25519') return next();

    // Check whether we're dealing with a time traveler
    const now = Math.floor(Date.now() / 1000);
    if (tokenBody.iat > now) return next(); // From the future
    if (tokenBody.exp < now) return next(); // Token expired

    // @ts-ignore The `supercop` library isn't typed (yet)
    const signatureValid = await (await keypair).verify(tokenSignature, [tokenParts[0],tokenParts[1]].join('.'));
    if (!signatureValid) return next();

    // Here = authenticated

    // Register the authentication data on the request
    // Specifically, in a way that tsc isn't bothered by
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
