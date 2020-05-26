import {Client, expect} from '@loopback/testlab';

import {ServerApplication} from '../../application';
import {Restaurant, User, USER_ROLE} from '../../models';
import {RestaurantRepository, ReviewRepository, UserRepository} from '../../repositories';
import {
  createARestaurant,
  createAUser,
  getUniqueRestaurantName,
  givenAnExpiredToken,
  givenAValidToken,
  itIsProtectedWithJWT,
  setupApplication,
} from '../helpers';

describe('RestaurantController', () => {
  let app: ServerApplication;
  let client: Client;

  let userRepo: UserRepository;
  let restaurantRepo: RestaurantRepository;
  let reviewRepo: ReviewRepository;

  let givenAUser: () => Promise<User>;
  let givenAnOwner: () => Promise<User>;
  let givenAnAdmin: () => Promise<User>;
  let givenARestaurant: (owner: User) => Promise<Restaurant>;

  const userPassword = 'p4ssw0rd';

  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    givenAUser = createAUser.bind(null, app, userPassword);
    givenAnOwner = createAUser.bind(null, app, userPassword, [USER_ROLE.USER, USER_ROLE.BUSINESS]);
    givenAnAdmin = createAUser.bind(null, app, userPassword, [USER_ROLE.USER, USER_ROLE.ADMIN]);
    givenARestaurant = createARestaurant.bind(null, app);
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

  describe('/restaurants', () => {

    describe('GET', () => {

      it('responds with a list of restaurants', async () => {
        const owner = await givenAnOwner();
        const restaurants = [
          await givenARestaurant(owner),
          await givenARestaurant(owner),
        ];
        const res = await client
          .get('/restaurants')
          .expect(200);

        expect(res.body.length).to.equal(restaurants.length);
        expect(res.body).to.matchEach({ownerId: owner.id});
      });

    });

    describe('POST', () => {

      it('allows a "business" user to create a restaurant', async () => {
        const owner = await givenAnOwner();
        const token = await givenAValidToken(owner);
        const restaurantName = getUniqueRestaurantName();
        const res = await client
          .post('/restaurants')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: restaurantName,
            ownerId: owner.id,
          })
          .expect(200);

        expect(res.body.name).to.equal(restaurantName);
        expect(res.body.ownerId).to.equal(owner.id);
      });

      it('does not allow a regular user to create a restaurant', async () => {
        const user = await givenAUser();
        const token = await givenAValidToken(user);
        const restaurantName = getUniqueRestaurantName();
        await client
          .post('/restaurants')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: restaurantName,
            ownerId: user.id,
          })
          // FIXME: 403
          .expect(401);
      });

      it('does not allow a "business" user to create a restaurant for other user', async () => {
        const owner = await givenAnOwner();
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(owner);
        const restaurantName = getUniqueRestaurantName();
        const res = await client
          .post('/restaurants')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: restaurantName,
            ownerId: otherOwner.id,
          })
          .expect(403);

        expect(res.body.error.message).to.equal('ownerId does not match the current user');
      });

      it('allows an admin to create a restaurant for any user', async () => {
        const admin = await givenAnAdmin();
        const owner = await givenAnOwner();
        const token = await givenAValidToken(admin);
        const restaurantName = getUniqueRestaurantName();
        const res = await client
          .post('/restaurants')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: restaurantName,
            ownerId: owner.id,
          })
          .expect(200);

        expect(res.body.name).to.equal(restaurantName);
        expect(res.body.ownerId).to.equal(owner.id);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'POST', () => `/restaurants`);

    });

  });

  describe('​/restaurants​/{id}', () => {

    let user: User;
    let owner: User;
    let admin: User;
    let restaurant: Restaurant;

    beforeEach(async () => {
      user = await givenAUser();
      owner = await givenAnOwner();
      admin = await givenAnAdmin();
      restaurant = await givenARestaurant(owner);
    });

    describe('GET', () => {

      it('responds with a restaurant data', async () => {
        const res = await client
          .get(`/restaurants/${restaurant.id}`)
          .expect(200);

        expect(res.body.id).to.equal(restaurant.id);
        expect(res.body.name).to.equal(restaurant.name);
        expect(res.body.ownerId).to.equal(restaurant.ownerId);
      });

    });

    describe('PUT', () => {

      it('allows an admin to modify a restaurant data', async () => {
        const token = await givenAValidToken(admin);
        await tryPutWithToken(token, true);
      });

      it('does not allow a regular user to modify a restaurant data', async () => {
        const token = await givenAValidToken(user);
        await tryPutWithToken(token, false);
      });

      it('does not allow a "business" user to modify his own restaurant data', async () => {
        const token = await givenAValidToken(owner);
        await tryPutWithToken(token, false);
      });

      it('does not allow a "business" user to modify not his own restaurant data', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryPutWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PUT', () => `/restaurants/${restaurant.id}`);

      async function tryPutWithToken(token: string, expectSuccess: boolean) {
        const oldName = restaurant.name;
        const newName = getUniqueRestaurantName();
        await client
          .put(`/restaurants/${restaurant.id}`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...restaurant,
            name: newName,
          })
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/restaurants/${restaurant.id}`)
          .expect(200);

        expect(res.body.name).to.equal(expectSuccess ? newName : oldName);
        expect(res.body.ownerId).to.equal(owner.id);
      }

    });

    describe('PATCH', () => {

      it('allows an admin to modify a restaurant data', async () => {
        const token = await givenAValidToken(admin);
        await tryPatchWithToken(token, true);
      });

      it('does not allow a regular user to modify a restaurant data', async () => {
        const token = await givenAValidToken(user);
        await tryPatchWithToken(token, false);
      });

      it('does not allow a "business" user to modify his own restaurant data', async () => {
        const token = await givenAValidToken(owner);
        await tryPatchWithToken(token, false);
      });

      it('does not allow a "business" user to modify not his own restaurant data', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryPatchWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PATCH', () => `/restaurants/${restaurant.id}`);

      async function tryPatchWithToken(token: string, expectSuccess: boolean) {
        const oldName = restaurant.name;
        const newName = getUniqueRestaurantName();
        await client
          .patch(`/restaurants/${restaurant.id}`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: newName,
          })
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/restaurants/${restaurant.id}`)
          .expect(200);

        expect(res.body.name).to.equal(expectSuccess ? newName : oldName);
        expect(res.body.ownerId).to.equal(owner.id);
      }
    });

    describe('DELETE', () => {

      it('allows an admin to delete a restaurant', async () => {
        const token = await givenAValidToken(admin);
        await tryDeleteWithToken(token, true);
      });

      it('does not allow a regular user to delete a restaurant', async () => {
        const token = await givenAValidToken(user);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a "business" user to delete his own restaurant', async () => {
        const token = await givenAValidToken(owner);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a "business" user to delete not his own restaurant', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryDeleteWithToken(token, false);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'DELETE', () => `/restaurants/${restaurant.id}`);

      async function tryDeleteWithToken(token: string, expectSuccess: boolean) {
        const oldName = restaurant.name;
        await client
          .delete(`/restaurants/${restaurant.id}`)
          .set('Authorization', 'Bearer ' + token)
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const res = await client
          .get(`/restaurants/${restaurant.id}`)
          .expect(expectSuccess ? 404 : 200);

        if (!expectSuccess) {
          expect(res.body.name).to.equal(oldName);
          expect(res.body.ownerId).to.equal(owner.id);
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
