import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Review, ReviewRelations, Restaurant, User, ReviewResponse} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RestaurantRepository} from './restaurant.repository';
import {UserRepository} from './user.repository';
import {ReviewResponseRepository} from './review-response.repository';

export class ReviewRepository extends DefaultCrudRepository<
  Review,
  typeof Review.prototype.id,
  ReviewRelations
> {

  public readonly restaurant: BelongsToAccessor<Restaurant, typeof Review.prototype.id>;

  public readonly author: BelongsToAccessor<User, typeof Review.prototype.id>;

  public readonly reviewResponses: HasManyRepositoryFactory<ReviewResponse, typeof Review.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('RestaurantRepository')
    protected restaurantRepositoryGetter: Getter<RestaurantRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ReviewResponseRepository') protected reviewResponseRepositoryGetter: Getter<ReviewResponseRepository>,
  ) {
    super(Review, dataSource);
    this.reviewResponses = this.createHasManyRepositoryFactoryFor('reviewResponses', reviewResponseRepositoryGetter,);
    this.registerInclusionResolver('reviewResponses', this.reviewResponses.inclusionResolver);
    this.author = this.createBelongsToAccessorFor('author', userRepositoryGetter,);
    this.registerInclusionResolver('author', this.author.inclusionResolver);
    this.restaurant = this.createBelongsToAccessorFor('restaurant', restaurantRepositoryGetter,);
    this.registerInclusionResolver('restaurant', this.restaurant.inclusionResolver);
  }
}
