import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Review, ReviewRelations, Restaurant, User} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RestaurantRepository} from './restaurant.repository';
import {UserRepository} from './user.repository';

export class ReviewRepository extends DefaultCrudRepository<
  Review,
  typeof Review.prototype.id,
  ReviewRelations
> {

  public readonly restaurant: BelongsToAccessor<Restaurant, typeof Review.prototype.id>;

  public readonly author: BelongsToAccessor<User, typeof Review.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('RestaurantRepository')
    protected restaurantRepositoryGetter: Getter<RestaurantRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Review, dataSource);
    this.author = this.createBelongsToAccessorFor('author', userRepositoryGetter,);
    this.registerInclusionResolver('author', this.author.inclusionResolver);
    this.restaurant = this.createBelongsToAccessorFor('restaurant', restaurantRepositoryGetter,);
    this.registerInclusionResolver('restaurant', this.restaurant.inclusionResolver);
  }
}
