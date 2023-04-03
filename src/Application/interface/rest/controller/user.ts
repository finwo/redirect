import { UserRepository } from '@app/domain/repository/user';
import { Controller, Req, Post, Get } from '@finwo/router';
import { FastifyRequest } from 'fastify';

@Controller('/v1/users')
export class UserController {
  constructor(
    userRepository: UserRepository
  ) {}

  @Get()
  async getUsers(
    @Req() req: FastifyRequest,
  ) {
    return {
      ok   : true,
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
