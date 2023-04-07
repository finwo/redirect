import { UserRepository } from '@app/domain/repository/user';
import { Controller, Req, Res, Post, Get } from '@finwo/router';
import { FastifyReply, FastifyRequest } from 'fastify';
import { window_time, keypair, token_expiry } from '@config/authentication';
import base64url from 'base64url';

const supercop = require('supercop');

@Controller('/v1/auth')
export class AuthController {
  constructor(
    private userRepository: UserRepository
  ) {}

  @Post()
  async getUsers(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    // Type-wrapping req.body
    const bdy = req.body as Record<string, string>;

    // Sanity checking
    if (
      (!req.body) ||
      ('object' !== typeof req.body)
    ) {
      res.status(400);
      return {
        statusCode : 400,
        code       : 'RDR_ERR_AUTHDATA_FMT',
        error      : 'Bad Request',
        message    : 'Bad Request: Improperly formatted request, expecting an object',
      };
    }

    // Check if the required fields are there
    const missingFields = [];
    if (!bdy.usr) missingFields.push('usr');
    if (!bdy.sig) missingFields.push('sig');
    if (!bdy.at) missingFields.push('at');
    if (missingFields.length) {
      return {
        statusCode : 422,
        code       : 'RDR_ERR_AUTHDATA_FLD_MISSING',
        error      : 'Unprocessable Entity',
        message    : `Unprocessable Entity: Missing field(s): ${missingFields.join(',')}`,
      };
    }

    // Verify timecode
    const now = Math.floor(Date.now() / 1000);
    if (
      ('number' !== typeof bdy.at) ||
      (Math.abs(now - bdy.at) > window_time)
    ) {
      return {
        statusCode : 403,
        code       : 'RDR_ERR_AUTHDATA_WDW_RANGE',
        error      : 'Forbidden',
        message    : `Forbidden: Message signed outside of allowed window`,
      };
    }

    // Fetch le user
    const user = await this.userRepository.getByUsername(bdy.usr);
    if (!user) {
      return {
        statusCode : 403,
        code       : 'RDR_ERR_PERMISSION_DENIED',
        error      : 'Permission denied',
        message    : 'Permission denied',
      };
    }
    const userpair = supercop.keyPairFrom({
      publicKey: Buffer.from(user.pubkey, 'base64'),
    });

    // Verify signature
    const message        = `${bdy.at}|${bdy.usr}|${bdy.at}`;
    const signatureValid = await userpair.verify(Buffer.from(bdy.sig, 'base64'), message);
    if (!signatureValid) {
      return {
        statusCode : 403,
        code       : 'RDR_ERR_PERMISSION_DENIED',
        error      : 'Permission denied',
        message    : 'Permission denied',
      };
    }

    // Here = user verified

    // Build le token
    const tokenHeader    = base64url.encode(JSON.stringify({ alg: 'ED25519', typ: 'JWTISH' }));
    const tokenBody      = base64url.encode(JSON.stringify({ sub: bdy.usr  , iat: now     , exp: now + token_expiry }));
    // @ts-ignore The `supercop` library isn't typed (yet)
    const tokenSignature = await (await keypair).sign(`${tokenHeader}.${tokenBody}`);

    return {
      ok    : true,
      token : `${tokenHeader}.${tokenBody}.${base64url(tokenSignature)}`,
    };
  }

}
