import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Review, ReviewRelations, Restaurant} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RestaurantRepository} from './restaurant.repository';

export class ReviewRepository extends DefaultCrudRepository<
  Review,
  typeof Review.prototype.id,
  ReviewRelations
> {

  public readonly restaurant: BelongsToAccessor<Restaurant, typeof Review.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('RestaurantRepository') protected restaurantRepositoryGetter: Getter<RestaurantRepository>,
  ) {
    super(Review, dataSource);
    this.restaurant = this.createBelongsToAccessorFor('restaurant', restaurantRepositoryGetter,);
    this.registerInclusionResolver('restaurant', this.restaurant.inclusionResolver);
  }
}
