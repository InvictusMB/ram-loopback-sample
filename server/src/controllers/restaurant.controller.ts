import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {Restaurant} from '../models';
import {RestaurantRepository, ReviewRepository} from '../repositories';
import {roleAuthorization} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class RestaurantController {
  constructor(
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
    @repository(ReviewRepository)
    public reviewRepository: ReviewRepository,
  ) {}

  @post('/restaurants', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Restaurant)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['business'],
    voters: [roleAuthorization],
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {
            title: 'NewRestaurant',
            exclude: ['id'],
          }),
        },
      },
    })
    restaurant: Omit<Restaurant, 'id'>,
  ): Promise<Restaurant> {
    if (!currentUserProfile.roles.includes('admin') && restaurant.ownerId !== currentUserProfile[securityId]) {
      throw new HttpErrors.Forbidden('ownerId does not match the current user');
    }
    return this.restaurantRepository.create(restaurant);
  }

  @get('/restaurants/count', {
    responses: {
      '200': {
        description: 'Restaurant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Restaurant) where?: Where<Restaurant>,
  ): Promise<Count> {
    return this.restaurantRepository.count(where);
  }

  @get('/restaurants', {
    responses: {
      '200': {
        description: 'Array of Restaurant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Restaurant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Restaurant) filter?: Filter<Restaurant>,
  ): Promise<Restaurant[]> {
    return this.restaurantRepository.find(filter);
  }

  @get('/restaurants/{id}', {
    responses: {
      '200': {
        description: 'Restaurant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Restaurant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Restaurant, {exclude: 'where'}) filter?: FilterExcludingWhere<Restaurant>,
  ): Promise<Restaurant> {
    return this.restaurantRepository.findById(id, filter);
  }

  @patch('/restaurants/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Restaurant PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {partial: true}),
        },
      },
    })
    restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.updateById(id, restaurant);
  }

  @put('/restaurants/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Restaurant PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.replaceById(id, restaurant);
  }

  @del('/restaurants/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Restaurant DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const reviews = await this.restaurantRepository.reviews(id).find();
    for (const review of reviews) {
      await this.reviewRepository.reviewResponses(review.id).delete();
    }
    await this.restaurantRepository.reviews(id).delete();
    await this.restaurantRepository.deleteById(id);
  }
}
