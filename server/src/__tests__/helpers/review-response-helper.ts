import {ServerApplication} from '../../application';
import {Review, ReviewResponse} from '../../models';
import {ReviewResponseRepository} from '../../repositories';
import {createFluentAPI} from './fluent-api-helper';

export async function createAReviewResponseBuilder(app: ServerApplication) {
  const reviewRepo: ReviewResponseRepository = await app.get('repositories.ReviewResponseRepository');

  return createFluentAPI(async (data: ReviewResponse) => {
    return reviewRepo.create(data);
  }, {
    forAReview(data, review: Review) {
      return {...data, reviewId: review.id};
    },
    withComment(data, comment: string) {
      return {...data, comment};
    },
  });
}
