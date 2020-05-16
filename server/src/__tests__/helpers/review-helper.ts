import {ServerApplication} from '../../application';
import {Restaurant, Review, User} from '../../models';
import {ReviewRepository} from '../../repositories';
import {createFluentAPI} from './fluent-api-helper';

export async function createAReviewBuilder(app: ServerApplication) {
  const reviewRepo: ReviewRepository = await app.get('repositories.ReviewRepository');

  return createFluentAPI(async (data: Review) => {
    return reviewRepo.create(data);
  }, {
    fromAnAuthor(data, author: User) {
      return {...data, authorId: author.id};
    },
    forARestaurant(data, restaurant: Restaurant) {
      return {...data, restaurantId: restaurant.id};
    },
    dated(data, date = new Date()) {
      return {...data, date: date.toISOString()};
    },
  });
}
