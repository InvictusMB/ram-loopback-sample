import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Restaurant, RestaurantRelations, Review} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ReviewRepository} from './review.repository';

export class RestaurantRepository extends DefaultCrudRepository<
  Restaurant,
  typeof Restaurant.prototype.id,
  RestaurantRelations
> {

  public readonly reviews: HasManyRepositoryFactory<Review, typeof Restaurant.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('ReviewRepository') protected reviewRepositoryGetter: Getter<ReviewRepository>,
  ) {
    super(Restaurant, dataSource);
    this.reviews = this.createHasManyRepositoryFactoryFor('reviews', reviewRepositoryGetter,);
    this.registerInclusionResolver('reviews', this.reviews.inclusionResolver);
  }
}
