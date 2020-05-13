import {inject, Getter} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {
  Restaurant,
  RestaurantRelations,
  Review,
  User,
} from '../models';
import {MemoryDataSource} from '../datasources';
import {ReviewRepository} from './review.repository';
import {UserRepository} from './user.repository';

export class RestaurantRepository extends DefaultCrudRepository<
  Restaurant,
  typeof Restaurant.prototype.id,
  RestaurantRelations
> {

  public readonly reviews: HasManyRepositoryFactory<Review, typeof Restaurant.prototype.id>;

  public readonly owner: BelongsToAccessor<User, typeof Restaurant.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('ReviewRepository') protected reviewRepositoryGetter: Getter<ReviewRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Restaurant, dataSource);
    this.owner = this.createBelongsToAccessorFor('owner', userRepositoryGetter,);
    this.registerInclusionResolver('owner', this.owner.inclusionResolver);
    this.reviews = this.createHasManyRepositoryFactoryFor('reviews', reviewRepositoryGetter,);
    this.registerInclusionResolver('reviews', this.reviews.inclusionResolver);
  }
}
