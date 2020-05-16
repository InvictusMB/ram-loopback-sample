import {Client, expect} from '@loopback/testlab';

import {ServerApplication} from '../../application';
import {Restaurant, Review, User, UserRole} from '../../models';
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

describe('RestaurantReviewController', () => {
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
    givenAnOwner = createAUser.bind(null, app, userPassword, ['user', 'business'] as UserRole[]);
    givenAnAdmin = createAUser.bind(null, app, userPassword, ['user', 'admin'] as UserRole[]);
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

  describe('/restaurants/{id}/reviews', () => {

    let user: User;
    let owner: User;
    let admin: User;
    let restaurant: Restaurant;
    let reviewData: Partial<Review>[];

    beforeEach(async () => {
      user = await givenAUser();
      owner = await givenAnOwner();
      admin = await givenAnAdmin();
      restaurant = await givenARestaurant(owner);

      reviewData = [{
        rating: 4,
        comment: 'Good',
      }, {
        rating: 3,
        comment: 'So-so',
      }];

      for (const data of reviewData) {
        await givenAReview(data)
          .fromAnAuthor(user)
          .forARestaurant(restaurant)
          .dated();
      }
    });

    describe('GET', () => {

      it('responds with a list of reviews for a given restaurant', async () => {
        const res = await client
          .get(`/restaurants/${restaurant.id}/reviews`)
          .expect(200);

        expect(res.body.length).to.equal(2);
        for (const i in reviewData) {
          expect(res.body[i]).to.match(reviewData[i]);
          expect(res.body[i]).to.match({authorId: user.id});
          expect(res.body[i]).to.match({restaurantId: restaurant.id});
        }
      });

    });

    describe('POST', () => {

      it('allows a regular user to post a review', async () => {
        await tryPostAsAccount(user, true);
      });

      it('validates min rating', async () => {
        await tryPostAgainstValidation(user, {rating: -1}, {
          path: '/rating',
          message: 'should be >= 1',
        });
      });

      it('validates max rating', async () => {
        await tryPostAgainstValidation(user, {rating: 10}, {
          path: '/rating',
          message: 'should be <= 5',
        });
      });

      it('validates non integer rating', async () => {
        await tryPostAgainstValidation(user, {rating: 2.5}, {
          path: '/rating',
          message: 'should be integer',
        });
      });

      it('allows a "business" user to post a review to his own restaurant', async () => {
        await tryPostAsAccount(owner, true);
      });

      it('allows a "business" user to post a review to other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryPostAsAccount(otherOwner, true);
      });

      it('allows an admin to post a review as a different user', async () => {
        await tryPostAsAccount(admin, true, user.id);
      });

      it('does not allow a regular user to post a review as a different user', async () => {
        const otherUser = await givenAnOwner();
        await tryPostAsAccount(user, false, otherUser.id);
      });

      it('does not allow a "business" user to post a review as a different user to his own restaurant', async () => {
        await tryPostAsAccount(owner, false, user.id);
      });

      it('does not allow a "business" user to post a review as a different user to other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryPostAsAccount(otherOwner, false, owner.id);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'POST', () => `/restaurants/${restaurant.id}/reviews`);

      async function tryPostAsAccount(account: User, expectSuccess: boolean, authorId = account.id) {
        const token = await givenAValidToken(account);
        const newRestaurant = await givenARestaurant(owner);
        const res = await client
          .post(`/restaurants/${newRestaurant.id}/reviews`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...reviewData[0],
            authorId,
            date: new Date().toISOString(),
          })
          .expect(expectSuccess ? 200 : 400);

        if (expectSuccess) {
          expect(res.body).to.have.ownProperty('id');
          expect(res.body).to.match(reviewData[0]);
          expect(res.body).to.match({authorId});
        } else {
          expect(res.body.error.message).to.equal('authorId does not match the current user');
        }
      }

      async function tryPostAgainstValidation(account: User, data: Partial<Review>, errorData: object) {
        const authorId = account.id;
        const token = await givenAValidToken(account);
        const newRestaurant = await givenARestaurant(owner);
        const res = await client
          .post(`/restaurants/${newRestaurant.id}/reviews`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...reviewData[0],
            authorId,
            date: new Date().toISOString(),
            ...data,
          })
          .expect(422);

        expect(res.body.error.details[0]).to.match(errorData);
      }
    });

    describe('DELETE', () => {

      it('allows an admin to delete all reviews', async () => {
        await tryDeleteAsAccount(admin, true);
      });

      it('does not allow a regular user to delete reviews', async () => {
        await tryDeleteAsAccount(user, false);
      });

      it('does not allow a "business" user to delete a reviews of his own restaurant', async () => {
        await tryDeleteAsAccount(owner, false);
      });

      it('does not allow a "business" user to delete a reviews of other owner\'s restaurant', async () => {
        const otherOwner = await givenAnOwner();
        await tryDeleteAsAccount(otherOwner, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'DELETE', () => `/restaurants/${restaurant.id}/reviews`);

      async function tryDeleteAsAccount(account: User, expectSuccess: boolean) {
        const reviews = await restaurantRepo.reviews(restaurant.id).find();
        expect(reviews.length).to.equal(reviewData.length);
        const token = await givenAValidToken(account);
        const res1 = await client
          .delete(`/restaurants/${restaurant.id}/reviews`)
          .set('Authorization', 'Bearer ' + token)
          // FIXME: 403
          .expect(expectSuccess ? 200 : 401);

        const res2 = await client
          .get(`/restaurants/${restaurant.id}/reviews`)
          .expect(200);

        if (expectSuccess) {
          expect(res1.body.count).to.equal(reviewData.length);
          expect(res2.body.length).to.equal(0);
        } else {
          expect(res2.body.length).to.equal(reviewData.length);
          expect(res2.body).to.matchEach({authorId: user.id});
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
