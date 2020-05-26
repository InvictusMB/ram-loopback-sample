import {Client, expect} from '@loopback/testlab';

import {ServerApplication} from '../../application';
import {Restaurant, Review, User, USER_ROLE} from '../../models';
import {RestaurantRepository, ReviewRepository, UserRepository} from '../../repositories';
import {
  createARestaurant,
  createAReviewBuilder,
  createAUser,
  givenAnExpiredToken,
  givenAValidToken,
  itIsProtectedWithJWT,
  setupApplication,
  UnwrapPromise,
} from '../helpers';

describe('ReviewController', () => {
  let app: ServerApplication;
  let client: Client;

  let userRepo: UserRepository;
  let restaurantRepo: RestaurantRepository;
  let reviewRepo: ReviewRepository;

  let givenAUser: () => Promise<User>;
  let givenAnOwner: () => Promise<User>;
  let givenAnAdmin: () => Promise<User>;
  let givenARestaurant: (owner: User) => Promise<Restaurant>;
  let givenAReview: UnwrapPromise<ReturnType<typeof createAReviewBuilder>>;

  const userPassword = 'p4ssw0rd';

  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    givenAUser = createAUser.bind(null, app, userPassword);
    givenAnOwner = createAUser.bind(null, app, userPassword, [USER_ROLE.USER, USER_ROLE.BUSINESS]);
    givenAnAdmin = createAUser.bind(null, app, userPassword, [USER_ROLE.USER, USER_ROLE.ADMIN]);
    givenARestaurant = createARestaurant.bind(null, app);
    givenAReview = await createAReviewBuilder(app);
    userRepo = await app.get('repositories.UserRepository');
    restaurantRepo = await app.get('repositories.RestaurantRepository');
    reviewRepo = await app.get('repositories.ReviewRepository');
  });
  before(migrateSchema);
  before(createExpiredToken);

  beforeEach(clearDatabase);

  after(async () => {
    await app.stop();
  });

  describe('/reviews', () => {

    describe('GET', () => {

      it('responds with a list of reviews', async () => {
        const owner = await givenAnOwner();
        const restaurants = [
          await givenARestaurant(owner),
          await givenARestaurant(owner),
        ];
        const user = await givenAUser();

        const reviewData = {
          rating: 4,
          comment: 'Good',
        };
        const review = givenAReview(reviewData).fromAnAuthor(user);
        for (const r of restaurants) {
          await review.dated().forARestaurant(r);
        }

        const res = await client
          .get('/reviews')
          .expect(200);

        expect(res.body.length).to.equal(2);
        expect(res.body).to.matchEach(reviewData);
        expect(res.body).to.matchEach({authorId: user.id});
        for (const i in restaurants) {
          expect(res.body[i]).to.match({restaurantId: restaurants[i].id});
        }
      });

    });

  });

  describe('/reviews/{id}', () => {

    let user: User;
    let owner: User;
    let admin: User;
    let restaurant: Restaurant;
    let review: Review;

    beforeEach(async () => {
      user = await givenAUser();
      owner = await givenAnOwner();
      admin = await givenAnAdmin();
      restaurant = await givenARestaurant(owner);
      review = await givenAReview({rating: 4, comment: 'Good'})
        .forARestaurant(restaurant)
        .fromAnAuthor(user)
        .dated();
    });

    describe('GET', () => {

      it('responds with a review data', async () => {
        const res = await client
          .get(`/reviews/${review.id}`)
          .expect(200);

        expect(res.body).to.match({rating: 4, comment: 'Good'});
        expect(res.body).to.match({authorId: user.id});
        expect(res.body).to.match({restaurantId: restaurant.id});
      });

    });

    describe('PUT', () => {

      it('allows an admin to modify a review data', async () => {
        const token = await givenAValidToken(admin);
        await tryPutWithToken(token, true);
      });

      it('does not allow a regular user to modify his review data', async () => {
        const token = await givenAValidToken(user);
        await tryPutWithToken(token, false);
      });

      it('does not allow a regular user to modify other user\'s review data', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await tryPutWithToken(token, false);
      });

      it('does not allow a "business" user to modify a review of his restaurant', async () => {
        const token = await givenAValidToken(owner);
        await tryPutWithToken(token, false);
      });

      it('does not allow a "business" user to modify a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryPutWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PUT', () => `/reviews/${review.id}`);

      async function tryPutWithToken(token: string, expectSuccess: boolean) {
        const oldComment = review.comment;
        const newComment = 'Bad';
        await client
          .put(`/reviews/${review.id}`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...review,
            comment: newComment,
          })
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/reviews/${review.id}`)
          .expect(200);

        expect(res.body.comment).to.equal(expectSuccess ? newComment : oldComment);
        expect(res.body.authorId).to.equal(user.id);
      }

    });

    describe('PATCH', () => {

      it('allows an admin to modify a review data', async () => {
        const token = await givenAValidToken(admin);
        await tryPatchWithToken(token, true);
      });

      it('does not allow a regular user to modify his review data', async () => {
        const token = await givenAValidToken(user);
        await tryPatchWithToken(token, false);
      });

      it('does not allow a regular user to modify other user\'s review data', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await tryPatchWithToken(token, false);
      });

      it('does not allow a "business" user to modify a review of his restaurant', async () => {
        const token = await givenAValidToken(owner);
        await tryPatchWithToken(token, false);
      });

      it('does not allow a "business" user to modify a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryPatchWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PATCH', () => `/reviews/${review.id}`);

      async function tryPatchWithToken(token: string, expectSuccess: boolean) {
        const oldComment = review.comment;
        const newComment = 'Bad';
        await client
          .patch(`/reviews/${review.id}`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            comment: newComment,
          })
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/reviews/${review.id}`)
          .expect(200);

        expect(res.body.comment).to.equal(expectSuccess ? newComment : oldComment);
        expect(res.body.authorId).to.equal(user.id);
      }

    });

    describe('DELETE', () => {

      it('allows an admin to delete a review', async () => {
        const token = await givenAValidToken(admin);
        await tryDeleteWithToken(token, true);
      });

      it('does not allow a regular user to delete his review', async () => {
        const token = await givenAValidToken(user);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a regular user to delete other user\'s review', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a "business" user to delete a review of his own restaurant', async () => {
        const token = await givenAValidToken(owner);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a "business" user to delete a review of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryDeleteWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'DELETE', () => `/reviews/${review.id}`);

      async function tryDeleteWithToken(token: string, expectSuccess: boolean) {
        const oldComment = review.comment;
        await client
          .delete(`/reviews/${review.id}`)
          .set('Authorization', 'Bearer ' + token)
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/reviews/${review.id}`)
          .expect(expectSuccess ? 404 : 200);

        if (!expectSuccess) {
          expect(res.body.comment).to.equal(oldComment);
          expect(res.body.authorId).to.equal(user.id);
        }
      }

    });

  });

  async function clearDatabase() {
    await userRepo.deleteAll();
    await restaurantRepo.deleteAll();
    await reviewRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createExpiredToken() {
    const newUser = await givenAUser();
    expiredToken = await givenAnExpiredToken(newUser);
  }
});
