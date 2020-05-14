import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
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
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {
  Restaurant,
  Review,
  User,
} from '../models';
import {RestaurantRepository} from '../repositories';
import {roleAuthorization} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

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
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Review>,
  ): Promise<Review[]> {
    return this.restaurantRepository.reviews(id).find(filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['user'],
    voters: [roleAuthorization],
  })
  @post('/restaurants/{id}/reviews', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Review)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
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
    if (!User.isAdmin(currentUserProfile) && review.authorId !== currentUserProfile[securityId]) {
      throw new HttpErrors.BadRequest('authorId does not match the current user');
    }
    return this.restaurantRepository.reviews(id).create(review);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  @del('/restaurants/{id}/reviews', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Restaurant.Review DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Review)) where?: Where<Review>,
  ): Promise<Count> {
    return this.restaurantRepository.reviews(id).delete(where);
  }
}
