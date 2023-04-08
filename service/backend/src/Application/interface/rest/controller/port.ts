// import { UserRepository } from '@app/domain/repository/user';
import { PortRepository } from '@app/domain/repository/port';
import { Controller, Req, Post, Get, Middleware, Res } from '@finwo/router';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedData, requireAuthentication } from '../../../../Authentication/middleware';
// import { FastifyReply, FastifyRequest } from 'fastify';
// import { detectAuthentication, AuthData, requireAuthentication, AuthenticatedData } from '../../../../Authentication/middleware';

@Controller('/v1/ports')
export class PortController {
  constructor(
    private portRepository: PortRepository
  ) {}

  // @Get()
  // @Middleware(detectAuthentication)
  // async getUsers(
  //   @Req() req: FastifyRequest & AuthData,
  // ) {

    // return {
    //   ok   : true,
    //   ...(await this.userRepository.find(opts))
    // };
  // }

  @Get()
  @Middleware(requireAuthentication)
  async listPorts(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply
  ) {
    const opts: {limit?:number,offset?:number} = {};
    const query = req.query as Record<string, string>;
    if (query.limit) opts.limit = parseInt(query.limit);
    if (query.offset) opts.offset = parseInt(query.offset);

    return {
      ok: true,
      port: await this.portRepository.find(opts),
    };
  }

  // // Provides POST route for domain method
  // @Post()
  // async createUser(@Req() req: FastifyRequest) {
  //   return {
  //     ok   : true,
  //   };
  // }

}
