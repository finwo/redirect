import { Port } from '@app/domain/model/port';
import { PortRepository } from '@app/domain/repository/port';
import { RepositoryListResponse } from '@core/repository-list-response';
import { Service } from '@finwo/di';
import { Repository } from 'typeorm';

@Service()
export class PortTypeormRepository extends PortRepository {

  private getTypeormRepository(): Repository<Port> {
    const { dataSource } = require('@core/data-source');
    return dataSource.getRepository(Port);
  }

  public async find(opts?: { limit: number, offset: number }): Promise<RepositoryListResponse<Port>> {
    opts = Object.assign({
      limit : 20,
      offset: 0,
    }, opts);
    const repo = this.getTypeormRepository();
    const data = await repo.find({
      skip: opts.offset,
      take: opts.limit,
    });
    return {
      ...opts,
      data,
    };
  }

  public async update(primaryKey: string, data: Partial<Port>): Promise<Port | null> {
    const repo = this.getTypeormRepository();
    await repo.update(primaryKey, data);
    const newKey = data.ingress || primaryKey;
    return repo.findOneBy({ ingress: newKey });
  }

  public async create(data: Partial<Port>): Promise<Port | null> {
    const repo = this.getTypeormRepository();
    const port = repo.create(data);
    await repo.insert(port);
    return port;
  }

}
