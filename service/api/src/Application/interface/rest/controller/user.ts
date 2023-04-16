import { User } from '@app/domain/model/user';
import { UserRepository } from '@app/domain/repository/user';
import { Controller, Req, Post, Get, Middleware, Res, Delete, Put } from '@finwo/router';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthData, requireAuthentication, AuthenticatedData } from '../../../../Authentication/middleware';
import { window_time } from '@config/authentication';

const supercop = require('supercop');

@Controller('/v1/users')
export class UserController {
  constructor(
    private userRepository: UserRepository
  ) {}

  @Get()
  @Middleware(requireAuthentication)
  async getUsers(
    @Req() req: FastifyRequest & AuthData,
  ) {
    const opts: {limit?:number,offset?:number} = {};
    const query = req.query as Record<string, string>;
    if (query.limit) opts.limit = parseInt(query.limit);
    if (query.offset) opts.offset = parseInt(query.offset);

    return {
      ok   : true,
      ...(await this.userRepository.find(opts))
    };
  }

  @Get('/self')
  @Middleware(requireAuthentication)
  async getUserSelf(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply
  ) {
    return {
      ok: true,
      user: await this.userRepository.getByUsername(req.auth.token.body.sub),
    };
  }

  // Provides POST route for domain method
  @Post()
  @Middleware(requireAuthentication)
  async createUser(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const bdy = req.body as (Partial<User> & { sig: string, timecode: number });

    // Sanity checking
    if (
      (!req.body                       ) ||
      ('object' !== typeof bdy         ) ||
      ('string' !== typeof bdy.username) ||
      ('string' !== typeof bdy.sig     ) ||
      ('string' !== typeof bdy.pubkey  )
    ) {
      res.status(422);
      return res.send({
        statusCode : 422,
        code       : 'RDR_ERR_UNPROCESSABLE_ENTITY',
        error      : 'Unprocessable Entity',
        message    : 'Unprocessable Entity',
      });
    }

    // Verify timecode
    const now = Math.floor(Date.now() / 1000);
    if (
      ('number' !== typeof bdy.timecode) ||
      (Math.abs(now - bdy.timecode) > window_time)
    ) {
      return {
        statusCode : 422,
        code       : 'RDR_ERR_WDW_RANGE',
        error      : 'Unprocessable Entity',
        message    : `Unprocessable Entity: Timecode out of allowed window`,
      };
    }

    // Verify signature
    const userpair = supercop.keyPairFrom({
      publicKey: Buffer.from(bdy.pubkey, 'base64'),
    });
    const message        = `${bdy.timecode}|${bdy.username}|${bdy.timecode}`;
    const signatureValid = await userpair.verify(Buffer.from(bdy.sig, 'base64'), message);
    if (!signatureValid) {
      return {
        statusCode : 422,
        code       : 'RDR_ERR_SIG_INVALID',
        error      : 'Unprocessable Entity',
        message    : 'Unprocessable Entity: Invalid signature',
      };
    }

    // Here = valid signature, let's save the user
    await this.userRepository.create({
      username: bdy.username,
      pubkey  : bdy.pubkey,
    });

    return {
      ok: true,
    };
  }

  @Put('/:userId')
  @Middleware(requireAuthentication)
  async editUser(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply,
  ) {
    const params = req.params as Record<string, string>;
    const bdy    = req.body as (Partial<User> & { sig ?: string; timecode?: number});
    const uid    = params.userId;

    // Sanity checking
    if (
      (!req.body                       ) ||
      ('object' !== typeof bdy         ) ||
      ('string' !== typeof bdy.username)
    ) {
      res.status(422);
      return res.send({
        statusCode : 422,
        code       : 'RDR_ERR_UNPROCESSABLE_ENTITY',
        error      : 'Unprocessable Entity',
        message    : 'Unprocessable Entity',
      });
    }

    const newUserData: Partial<User> = { username: bdy.username };

    // Require more fields if updating the password
    if (bdy.pubkey && 'string' === typeof bdy.pubkey) {

      // Sanity checking
      if (
        ('number' !== typeof bdy.timecode) ||
        ('string' !== typeof bdy.sig     )
      ) {
        res.status(422);
        return res.send({
          statusCode : 422,
          code       : 'RDR_ERR_UNPROCESSABLE_ENTITY',
          error      : 'Unprocessable Entity',
          message    : 'Unprocessable Entity',
        });
      }

      // Verify timecode
      const now = Math.floor(Date.now() / 1000);
      if (
        ('number' !== typeof bdy.timecode) ||
        (Math.abs(now - bdy.timecode) > window_time)
      ) {
        return {
          statusCode : 422,
          code       : 'RDR_ERR_WDW_RANGE',
          error      : 'Unprocessable Entity',
          message    : `Unprocessable Entity: Timecode out of allowed window`,
        };
      }

      // Verify signature
      const userpair = supercop.keyPairFrom({
        publicKey: Buffer.from(bdy.pubkey, 'base64'),
      });
      const message        = `${bdy.timecode}|${bdy.username}|${bdy.timecode}`;
      const signatureValid = await userpair.verify(Buffer.from(bdy.sig, 'base64'), message);
      if (!signatureValid) {
        return {
          statusCode : 422,
          code       : 'RDR_ERR_SIG_INVALID',
          error      : 'Unprocessable Entity',
          message    : 'Unprocessable Entity: Invalid signature',
        };
      }

      // Here = valid
      newUserData.pubkey = bdy.pubkey;
    }

    const updatedUser = await this.userRepository.update(uid, newUserData);

    return {
      ok: true,
      user: updatedUser,
    };
  }

  @Delete('/:userId')
  @Middleware(requireAuthentication)
  async deleteUser(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply,
  ) {
    const params = req.params as Record<string, string>;
    const uid    = params.userId;

    await this.userRepository.delete(uid);

    return {
      ok: true,
    };
  }
}
