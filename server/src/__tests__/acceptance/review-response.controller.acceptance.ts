import {Client, expect} from '@loopback/testlab';

import {ServerApplication} from '../../application';
import {Restaurant, Review, User, UserRole} from '../../models';
import {RestaurantRepository, ReviewRepository, ReviewResponseRepository, UserRepository} from '../../repositories';
import {
  createARestaurant,
  createAReviewBuilder,
  createAReviewResponseBuilder,
  createAUser,
  givenAnExpiredToken,
  givenAValidToken,
  itIsProtectedWithJWT,
  setupApplication,
  UnwrapPromise,
} from '../helpers';

describe('ReviewResponseController', () => {
  let app: ServerApplication;
  let client: Client;

  let userRepo: UserRepository;
  let restaurantRepo: RestaurantRepository;
  let reviewRepo: ReviewRepository;
  let reviewResponseRepo: ReviewResponseRepository;

  let givenAUser: () => Promise<User>;
  let givenAnOwner: () => Promise<User>;
  let givenAnAdmin: () => Promise<User>;
  let givenARestaurant: (owner: User) => Promise<Restaurant>;
  let givenAReview: UnwrapPromise<ReturnType<typeof createAReviewBuilder>>;
  let givenAReviewResponse: UnwrapPromise<ReturnType<typeof createAReviewResponseBuilder>>;

  const userPassword = 'p4ssw0rd';

  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    givenAUser = createAUser.bind(null, app, userPassword);
    givenAnOwner = createAUser.bind(null, app, userPassword, ['user', 'business'] as UserRole[]);
    givenAnAdmin = createAUser.bind(null, app, userPassword, ['user', 'admin'] as UserRole[]);
    givenARestaurant = createARestaurant.bind(null, app);
    givenAReview = await createAReviewBuilder(app);
    givenAReviewResponse = await createAReviewResponseBuilder(app);
    userRepo = await app.get('repositories.UserRepository');
    restaurantRepo = await app.get('repositories.RestaurantRepository');
    reviewRepo = await app.get('repositories.ReviewRepository');
    reviewResponseRepo = await app.get('repositories.ReviewResponseRepository');
  });
  before(migrateSchema);
  before(createExpiredToken);

  beforeEach(clearDatabase);

  after(async () => {
    await app.stop();
  });

  describe('/reviews/{id}/responses', () => {

    let user: User;
    let owner: User;
    let admin: User;
    let restaurant: Restaurant;
    let reviewData: Partial<Review>;
    let review: Review;
    let reviewWithResponse: Review;

    beforeEach(async () => {
      user = await givenAUser();
      owner = await givenAnOwner();
      admin = await givenAnAdmin();
      restaurant = await givenARestaurant(owner);

      reviewData = {
        rating: 1,
        comment: 'Awful',
      };

      reviewWithResponse = await givenAReview(reviewData)
        .fromAnAuthor(user)
        .forARestaurant(restaurant)
        .dated();

      await givenAReviewResponse()
        .forAReview(reviewWithResponse)
        .withComment('Sorry');

      review = await givenAReview(reviewData)
        .fromAnAuthor(user)
        .forARestaurant(restaurant)
        .dated();

    });

    describe('POST', () => {

      it('allows a "business" user to post a response to a review of his own restaurant', async () => {
        await tryPostAsAccount(owner, review);
      });

      it('allows an admin to post a response to a review of his own restaurant', async () => {
        await tryPostAsAccount(admin, review);
      });

      it('does not allow a regular user to post a response to a review', async () => {
        await tryPostAsAccount(user, review, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to post a response to review of his own restaurant twice', async () => {
        await tryPostAsAccount(owner, reviewWithResponse, {
          statusCode: 400,
          message: 'Review can have only one response',
        });
      });

      it('does not allow an admin to post a response to review twice', async () => {
        await tryPostAsAccount(admin, reviewWithResponse, {
          statusCode: 400,
          message: 'Review can have only one response',
        });
      });

      it('does not allow a "business" user to post a response to a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryPostAsAccount(otherOwner, review, {
          statusCode: 400,
          message: 'Restaurant owner does not match the current user',
        });
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'POST', () => `/restaurants/${restaurant.id}/reviews`);

      async function tryPostAsAccount(account: User, toReview: Review, expectedError? : ExpectedError) {
        const token = await givenAValidToken(account);
        const comment = 'Sorry';
        const res = await client
          .post(`/reviews/${toReview.id}/responses`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            comment,
          })
          .expect(expectedError ? expectedError!.statusCode : 200);

        if (expectedError) {
          expect(res.body.error).to.match(expectedError);
        } else {
          expect(res.body).to.have.ownProperty('id');
          expect(res.body).to.match({
            reviewId: toReview.id,
            comment,
          });
        }
      }
      type ExpectedError = {
        statusCode: number,
        message?: string,
      }

    });

    describe('PUT', () => {

      it('allows an admin to modify a response to a review', async () => {
        await tryPutAsAccount(admin, reviewWithResponse);
      });

      it('succeeds silently if there were no responses', async () => {
        await tryPutAsAccount(admin, review);
      });

      it('does not allow a "business" user to modify a response to a review of his own restaurant', async () => {
        await tryPutAsAccount(owner, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a regular user to modify a response to a review', async () => {
        await tryPutAsAccount(user, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to modify a response to a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryPutAsAccount(otherOwner, review, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PUT', () => `/reviews/${review.id}/responses`);

      async function tryPutAsAccount(account: User, toReview: Review, expectedError? : ExpectedError) {
        const responses = await reviewRepo.reviewResponses(toReview.id).find();
        const token = await givenAValidToken(account);
        const comment = 'Not Really Sorry';
        const res = await client
          .put(`/reviews/${toReview.id}/responses`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            comment,
          })
          .expect(expectedError ? expectedError!.statusCode : 200);

        if (expectedError) {
          expect(res.body.error).to.match(expectedError);
        } else {
          expect(res.body.count).to.equal(responses.length);
        }
      }
      type ExpectedError = {
        statusCode: number,
        message?: string,
      }

    });

    describe('PATCH', () => {

      it('allows an admin to modify a response to a review', async () => {
        await tryPatchAsAccount(admin, reviewWithResponse);
      });

      it('succeeds silently if there were no responses', async () => {
        await tryPatchAsAccount(admin, review);
      });

      it('does not allow a regular user to modify a response to a review', async () => {
        await tryPatchAsAccount(user, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to modify a response to a review of his own restaurant', async () => {
        await tryPatchAsAccount(owner, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to modify a response to a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryPatchAsAccount(otherOwner, review, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PATCH', () => `/reviews/${review.id}/responses`);

      async function tryPatchAsAccount(account: User, toReview: Review, expectedError? : ExpectedError) {
        const responses = await reviewRepo.reviewResponses(toReview.id).find();
        const token = await givenAValidToken(account);
        const comment = 'Not Really Sorry';
        const res = await client
          .patch(`/reviews/${toReview.id}/responses`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            comment,
          })
          .expect(expectedError ? expectedError!.statusCode : 200);

        if (expectedError) {
          expect(res.body.error).to.match(expectedError);
        } else {
          expect(res.body.count).to.equal(responses.length);
        }
      }
      type ExpectedError = {
        statusCode: number,
        message?: string,
      }

    });

    describe('DELETE', () => {

      it('allows an admin to delete a response to a review', async () => {
        await tryDeleteAsAccount(admin, reviewWithResponse);
      });

      it('succeeds silently if there were no responses', async () => {
        await tryDeleteAsAccount(admin, review);
      });

      it('does not allow a regular user to delete a response to a review', async () => {
        await tryDeleteAsAccount(user, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to delete a response to a review of his own restaurant', async () => {
        await tryDeleteAsAccount(owner, reviewWithResponse, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      it('does not allow a "business" user to delete a response to a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryDeleteAsAccount(otherOwner, review, {
          // FIXME: 403
          statusCode: 401,
        });
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'DELETE', () => `/reviews/${review.id}/responses`);

      async function tryDeleteAsAccount(account: User, toReview: Review, expectedError? : ExpectedError) {
        const responses = await reviewRepo.reviewResponses(toReview.id).find();
        const token = await givenAValidToken(account);
        const res = await client
          .delete(`/reviews/${toReview.id}/responses`)
          .set('Authorization', 'Bearer ' + token)
          .expect(expectedError ? expectedError!.statusCode : 200);

        if (expectedError) {
          expect(res.body.error).to.match(expectedError);
        } else {
          expect(res.body.count).to.equal(responses.length);
        }
      }
      type ExpectedError = {
        statusCode: number,
        message?: string,
      }

    });

  });

  async function clearDatabase() {
    await userRepo.deleteAll();
    await restaurantRepo.deleteAll();
    await reviewRepo.deleteAll();
    await reviewResponseRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createExpiredToken() {
    const newUser = await givenAUser();
    expiredToken = await givenAnExpiredToken(newUser);
  }
});
