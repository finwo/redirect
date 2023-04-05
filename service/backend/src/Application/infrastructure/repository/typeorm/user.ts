import { User } from '@app/domain/model/user';
import { UserRepository } from '@app/domain/repository/user';
import { RepositoryListResponse } from '@core/repository-list-response';
import { Service } from '@finwo/di';
import { Repository } from 'typeorm';
// import * as path from 'path';
// import * as fs from 'fs';
// import { User } from '@pico/domain/model/user.model';
// import { UserRepository } from '@pico/domain/repository/user.repository';

// const storageFile = path.resolve(__dirname, '../../../../../data/users.json');

@Service()
export class UserTypeormRepository extends UserRepository {

  private getTypeormRepository(): Repository<User> {
    const { dataSource } = require('@core/data-source');
    return dataSource.getRepository(User);
  }

  public async find(opts?: { limit: number, offset: number }): Promise<RepositoryListResponse<User>> {
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

  public async saveUser(entity: User): Promise<void> {
    const repo = this.getTypeormRepository();
    await repo.save(entity);
  }

//   public async findAll(): Promise<User[]> {
//     const entities = JSON.parse(fs.readFileSync(storageFile).toString());
//     return entities.map((entity: any) => User.fromData(entity));
//   }

//   public async findByName(name: string): Promise<User[]> {
//     const entities = await this.findAll();
//     return entities.filter(entity => ~entity.name.indexOf(name));
//   }


}
