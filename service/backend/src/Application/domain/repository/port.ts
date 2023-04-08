import { Service } from '@finwo/di';
import { Port } from '@app/domain/model/port';
import { RepositoryListResponse } from '@core/repository-list-response';

@Service()
export abstract class PortRepository {
  public abstract find(opts?: { limit?: number, offset?: number }): Promise<RepositoryListResponse<Port>>;
}
