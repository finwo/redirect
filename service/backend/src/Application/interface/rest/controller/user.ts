import { UserRepository } from '@app/domain/repository/user';
import { Controller, Req, Post, Get, Middleware, Res } from '@finwo/router';
import { FastifyReply, FastifyRequest } from 'fastify';
import { detectAuthentication, AuthData, requireAuthentication, AuthenticatedData } from '../../../../Authentication/middleware';

@Controller('/v1/users')
export class UserController {
  constructor(
    private userRepository: UserRepository
  ) {}

  @Get()
  @Middleware(detectAuthentication)
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
  async createUser(@Req() req: FastifyRequest) {
    return {
      ok   : true,
    };
  }
}
