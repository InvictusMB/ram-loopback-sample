import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Restaurant,
  Review,
} from '../models';
import {RestaurantRepository} from '../repositories';

export class RestaurantReviewController {
  constructor(
    @repository(RestaurantRepository) protected restaurantRepository: RestaurantRepository,
  ) { }

  @get('/restaurants/{id}/reviews', {
    responses: {
      '200': {
        description: 'Array of Restaurant reviews',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Review, {includeRelations: true})},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Review>,
  ): Promise<Review[]> {
    return this.restaurantRepository.reviews(id).find(filter);
  }

  @post('/restaurants/{id}/reviews', {
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Review)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Restaurant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {
            title: 'NewReviewInRestaurant',
            exclude: ['id', 'restaurantId'],
          }),
        },
      },
    }) review: Omit<Review, 'id' | 'restaurantId'>,
  ): Promise<Review> {
    return this.restaurantRepository.reviews(id).create(review);
  }

  @del('/restaurants/{id}/reviews', {
    responses: {
      '200': {
        description: 'Restaurant.Review DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Review)) where?: Where<Review>,
  ): Promise<Count> {
    return this.restaurantRepository.reviews(id).delete(where);
  }
}
