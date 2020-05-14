import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Review} from '../models';
import {ReviewRepository} from '../repositories';
import {roleAuthorization} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class ReviewController {
  constructor(
    @repository(ReviewRepository)
    public reviewRepository : ReviewRepository,
  ) {}

  @get('/reviews/count', {
    responses: {
      '200': {
        description: 'Review model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Review) where?: Where<Review>,
  ): Promise<Count> {
    return this.reviewRepository.count(where);
  }

  @get('/reviews', {
    responses: {
      '200': {
        description: 'Array of Review model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Review, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Review) filter?: Filter<Review>,
  ): Promise<Review[]> {
    return this.reviewRepository.find(filter);
  }

  @get('/reviews/{id}', {
    responses: {
      '200': {
        description: 'Review model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Review, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Review, {exclude: 'where'}) filter?: FilterExcludingWhere<Review>
  ): Promise<Review> {
    return this.reviewRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  @patch('/reviews/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Review PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {partial: true}),
        },
      },
    })
    review: Review,
  ): Promise<void> {
    await this.reviewRepository.updateById(id, review);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  @put('/reviews/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Review PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() review: Review,
  ): Promise<void> {
    await this.reviewRepository.replaceById(id, review);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  @del('/reviews/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Review DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.reviewRepository.deleteById(id);
  }
}
