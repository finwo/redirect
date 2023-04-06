import { Service } from '@finwo/di';
import { User } from '@app/domain/model/user';
import { RepositoryListResponse } from '@core/repository-list-response';

@Service()
export abstract class UserRepository {
  public abstract saveUser(entity: User): Promise<void>;
  public abstract find(opts?: { limit?: number, offset?: number }): Promise<RepositoryListResponse<User>>;
  public abstract getByUsername(username: string): Promise<User | null>;
}
