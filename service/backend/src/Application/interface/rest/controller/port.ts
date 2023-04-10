// import { UserRepository } from '@app/domain/repository/user';
import { Port } from '@app/domain/model/port';
import { PortRepository } from '@app/domain/repository/port';
import { Controller, Req, Post, Get, Middleware, Res, Put, Delete } from '@finwo/router';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedData, requireAuthentication } from '../../../../Authentication/middleware';
// import { FastifyReply, FastifyRequest } from 'fastify';
// import { detectAuthentication, AuthData, requireAuthentication, AuthenticatedData } from '../../../../Authentication/middleware';

@Controller('/v1/ports')
export class PortController {
  constructor(
    private portRepository: PortRepository
  ) {}

  @Get()
  @Middleware(requireAuthentication)
  async listPorts(
    @Req() req: FastifyRequest & AuthenticatedData
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

  @Put('/:portId')
  @Middleware(requireAuthentication)
  async editPort(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply,
  ) {
    const params = req.params as Record<string, string>;
    const bdy    = req.body as Partial<Port>;
    const pid    = params.portId;

    // Sanity checking
    if (
      (!req.body                      ) ||
      ('object' !== typeof bdy        ) ||
      ('string' !== typeof bdy.ingress) ||
      ('string' !== typeof bdy.egress )
    ) {
      res.status(422);
      return res.send({
        statusCode : 422,
        code       : 'RDR_ERR_UNPROCESSABLE_ENTITY',
        error      : 'Unprocessable Entity',
        message    : 'Unprocessable Entity',
      });
    }

    const updatedPort = await this.portRepository.update(pid, bdy);

    return {
      ok: true,
      port: updatedPort,
    };
  }

  @Post()
  @Middleware(requireAuthentication)
  async createPort(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply,
  ) {
    const bdy = req.body as Partial<Port>;

    // Sanity checking
    if (
      (!req.body                      ) ||
      ('object' !== typeof bdy        ) ||
      ('string' !== typeof bdy.ingress) ||
      ('string' !== typeof bdy.egress )
    ) {
      res.status(422);
      return res.send({
        statusCode : 422,
        code       : 'RDR_ERR_UNPROCESSABLE_ENTITY',
        error      : 'Unprocessable Entity',
        message    : 'Unprocessable Entity',
      });
    }

    const createdPort = await this.portRepository.create(bdy);

    return {
      ok: true,
      port: createdPort,
    };
  }

  @Delete('/:portId')
  @Middleware(requireAuthentication)
  async deletePort(
    @Req() req: FastifyRequest & AuthenticatedData,
    @Res() res: FastifyReply,
  ) {
    const params = req.params as Record<string, string>;
    const pid    = params.portId;

    await this.portRepository.delete(pid);

    return {
      ok: true,
    };
  }


}
