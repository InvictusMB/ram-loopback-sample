import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  getWhereSchemaFor, HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {
  Review,
  ReviewResponse,
  User,
} from '../models';
import {ReviewRepository} from '../repositories';
import {roleAuthorization} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class ReviewResponseController {
  constructor(
    @repository(ReviewRepository) protected reviewRepository: ReviewRepository,
  ) { }

  @post('/reviews/{id}/responses', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Review model instance',
        content: {'application/json': {schema: getModelSchemaRef(ReviewResponse)}},
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
    @param.path.string('id') id: typeof Review.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ReviewResponse, {
            title: 'NewReviewResponseInReview',
            exclude: ['id', 'reviewId'],
          }),
        },
      },
    }) reviewResponse: Omit<ReviewResponse, 'id' | 'reviewId'>,
  ): Promise<ReviewResponse> {
    const restaurant = await this.reviewRepository.restaurant(id);
    if (restaurant?.ownerId !== currentUserProfile[securityId] && !User.isAdmin(currentUserProfile)) {
      throw new HttpErrors.BadRequest('Restaurant owner does not match the current user');
    }
    const responses = await this.reviewRepository.reviewResponses(id).find();
    if (responses.length) {
      throw new HttpErrors.BadRequest('Review can have only one response');
    }
    return this.reviewRepository.reviewResponses(id).create(reviewResponse);
  }

  @put('/reviews/{id}/responses', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Review.ReviewResponse PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async replace(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ReviewResponse, {partial: true}),
        },
      },
    })
    reviewResponse: Partial<ReviewResponse>,
    @param.query.object('where', getWhereSchemaFor(ReviewResponse)) where?: Where<ReviewResponse>,
  ): Promise<Count> {
    return this.reviewRepository.reviewResponses(id).patch(reviewResponse, where);
  }

  @patch('/reviews/{id}/responses', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Review.ReviewResponse PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async update(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ReviewResponse, {partial: true}),
        },
      },
    })
    reviewResponse: Partial<ReviewResponse>,
    @param.query.object('where', getWhereSchemaFor(ReviewResponse)) where?: Where<ReviewResponse>,
  ): Promise<Count> {
    return this.reviewRepository.reviewResponses(id).patch(reviewResponse, where);
  }

  @del('/reviews/{id}/responses', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Review.ReviewResponse DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ReviewResponse)) where?: Where<ReviewResponse>,
  ): Promise<Count> {
    return this.reviewRepository.reviewResponses(id).delete(where);
  }
}
