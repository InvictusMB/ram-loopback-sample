import {DefaultCrudRepository} from '@loopback/repository';
import {ReviewResponse, ReviewResponseRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ReviewResponseRepository extends DefaultCrudRepository<
  ReviewResponse,
  typeof ReviewResponse.prototype.id,
  ReviewResponseRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(ReviewResponse, dataSource);
  }
}
