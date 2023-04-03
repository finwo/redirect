import { Service } from '@finwo/di';
import { User } from '@app/domain/model/user';

@Service()
export abstract class UserRepository {
  // public abstract saveUser(entity: User): Promise<boolean>;
  // public abstract findAll(): Promise<User[]>;
  // public abstract findByName(name: string): Promise<User[]>;
}
