import { Port } from '@app/domain/model/port';
import { PortRepository } from '@app/domain/repository/port';
import { Service } from '@finwo/di';
// import * as path from 'path';
// import * as fs from 'fs';
// import { User } from '@pico/domain/model/user.model';
// import { UserRepository } from '@pico/domain/repository/user.repository';

// const storageFile = path.resolve(__dirname, '../../../../../data/users.json');

@Service()
export class PortTypeormRepository extends PortRepository {

  private getTypeormRepository() {
    const { dataSource } = require('@core/data-source');
    return dataSource.getRepository(Port);
  }

//   public async saveUser(entity: User): Promise<boolean> {
//     try {
//       const entities = JSON.parse(fs.readFileSync(storageFile).toString());
//       entities.push(entity);
//       fs.writeFileSync(storageFile, JSON.stringify(entities));
//       return true;
//     } catch(e: any) {
//       console.warn(e);
//       return false;
//     }
//   }

//   public async findAll(): Promise<User[]> {
//     const entities = JSON.parse(fs.readFileSync(storageFile).toString());
//     return entities.map((entity: any) => User.fromData(entity));
//   }

//   public async findByName(name: string): Promise<User[]> {
//     const entities = await this.findAll();
//     return entities.filter(entity => ~entity.name.indexOf(name));
//   }


}
