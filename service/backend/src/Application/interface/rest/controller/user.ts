import { UserRepository } from '@app/domain/repository/user';
import { Controller, Req, Post, Get } from '@finwo/router';
import { FastifyRequest } from 'fastify';

@Controller('/v1/users')
export class UserController {
  constructor(
    private userRepository: UserRepository
  ) {}

  @Get()
  async getUsers(
    @Req() req: FastifyRequest,
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

  // Provides POST route for domain method
  @Post()
  async createUser(@Req() req: FastifyRequest) {
    return {
      ok   : true,
    };
  }
}
