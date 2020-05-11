import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Review,
  Restaurant,
} from '../models';
import {ReviewRepository} from '../repositories';

export class ReviewRestaurantController {
  constructor(
    @repository(ReviewRepository)
    public reviewRepository: ReviewRepository,
  ) { }

  @get('/reviews/{id}/restaurant', {
    responses: {
      '200': {
        description: 'Restaurant belonging to Review',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Restaurant)},
          },
        },
      },
    },
  })
  async getRestaurant(
    @param.path.number('id') id: typeof Review.prototype.id,
  ): Promise<Restaurant> {
    return this.reviewRepository.restaurant(id);
  }
}
