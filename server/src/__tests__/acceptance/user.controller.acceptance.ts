import {Client, expect} from '@loopback/testlab';
import {HTTPError} from 'superagent';

import {ServerApplication} from '../../application';
import {User, USER_ROLE} from '../../models';
import {UserRepository} from '../../repositories';
import {
  createAUser,
  getUniqueUserName,
  givenAnExpiredToken,
  givenAValidToken,
  itIsProtectedWithJWT,
  setupApplication,
  toCredentials,
} from '../helpers';

describe('UserController', () => {
  let app: ServerApplication;
  let client: Client;

  let userRepo: UserRepository;

  let givenAUser: () => Promise<User>;
  let givenAnOwner: () => Promise<User>;
  let givenAnAdmin: () => Promise<User>;

  const regularRoles = [USER_ROLE.USER];
  const ownerRoles = [USER_ROLE.USER, USER_ROLE.BUSINESS];
  const adminRoles = [USER_ROLE.USER, USER_ROLE.ADMIN];
  const userData = {
    name: 'user',
    roles: regularRoles,
  };

  const userPassword = 'p4ssw0rd';

  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    givenAUser = createAUser.bind(null, app, userPassword);
    givenAnOwner = createAUser.bind(null, app, userPassword, ownerRoles);
    givenAnAdmin = createAUser.bind(null, app, userPassword, adminRoles);
    userRepo = await app.get('repositories.UserRepository');
  });
  before(migrateSchema);
  before(createExpiredToken);

  beforeEach(clearDatabase);

  after(async () => {
    await app.stop();
  });

  describe('/users', () => {

    let admin: User;

    beforeEach(async () => {
      admin = await givenAnAdmin();
    });

    describe('POST', () => {

      it('creates a new user', async () => {
        const res = await client
          .post('/users')
          .send({
            ...toCredentials(userData),
            password: userPassword,
          })
          .expect(200);

        expect(res.body.name).to.equal('user');
        expect(res.body).to.have.property('id');
        expect(res.body).to.not.have.property('password');
      });

      it('responds with an error when a password is missing', async () => {
        const res = await client
          .post('/users')
          .send({
            login: 'user',
          })
          .expect(422);

        expect(res.error).to.not.eql(false);
        const resError = res.error as HTTPError;
        const errorText = JSON.parse(resError.text);
        expect(errorText.error.details[0].info.missingProperty).to.equal(
          'password',
        );
      });

      it('responds with an error when a string is sent', async () => {
        const res = await client.post('/users').send('hello').expect(415);
        expect(res.body.error.message).to.equal(
          'Content-type application/x-www-form-urlencoded does not match [application/json].',
        );
      });

      it('responds with an error when a role does not exist', async () => {
        const res = await client
          .post('/users')
          .send({
            ...toCredentials(userData),
            roles: ['foo'],
            password: userPassword,
          })
          .expect(422);

        expect(res.body.error.details[0].message).to.equal('should be equal to one of the allowed values');
      });

      it('responds with an error when a login already exists', async () => {
        await client
          .post('/users')
          .send({...toCredentials(userData), password: userPassword})
          .expect(200);
        const res = await client
          .post('/users')
          .send({...toCredentials(userData), password: userPassword})
          .expect(409);

        expect(res.body.error.message).to.equal('User login is already taken');
      });

      it('allows everyone to create only a "user" account', async () => {
        const res = await client
          .post('/users')
          .send({
            ...toCredentials(userData),
            roles: ownerRoles,
            password: userPassword,
          })
          .expect(200);

        expect(res.body.roles).to.deepEqual(regularRoles);
      });

      it('allows an admin to create a "business" account', async () => {
        const token = await givenAValidToken(admin);
        const res = await client
          .post('/users')
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...toCredentials(userData),
            roles: ownerRoles,
            password: userPassword,
          })
          .expect(200);

        expect(res.body.roles).to.deepEqual(ownerRoles);
      });

      it('allows an admin to create another "admin" account', async () => {
        const token = await givenAValidToken(admin);
        const res = await client
          .post('/users')
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...toCredentials(userData),
            roles: adminRoles,
            password: userPassword,
          })
          .expect(200);

        expect(res.body.roles).to.deepEqual(adminRoles);
      });

    });

  });

  describe('/users/{id}', () => {

    let user: User;
    let owner: User;
    let admin: User;

    beforeEach(async () => {
      user = await givenAUser();
      owner = await givenAnOwner();
      admin = await givenAnAdmin();
    });

    describe('GET', () => {

      it('responds with the user profile when a valid JWT token is provided', async () => {
        const token = await givenAValidToken(user);
        const res = await client
          .get(`/users/${user.id}`)
          .set('Authorization', 'Bearer ' + token)
          .expect(200);

        const userProfile = res.body;
        expect(userProfile.id).to.equal(user.id);
        expect(userProfile.name).to.equal(user.name);
        expect(userProfile.roles).to.deepEqual(user.roles);
      });

      it('responds with an error when accessing other user', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await client
          .get(`/users/${user.id}`)
          .set('Authorization', 'Bearer ' + token)
          // FIXME: 403
          .expect(401);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'GET', () => `/users/${user.id}`);

    });

    describe('PUT', () => {

      it('allows an admin to update a regular account', async () => {
        const token = await givenAValidToken(admin);
        await tryPutWithToken(token, true);
      });

      it('allows an admin to update a "business" account', async () => {
        const token = await givenAValidToken(admin);
        await tryPutWithToken(token, true, owner);
      });

      it('allows a regular user to update his own account', async () => {
        const token = await givenAValidToken(user);
        await tryPutWithToken(token, true);
      });

      it('does allow a "business" user to update his own account', async () => {
        const token = await givenAValidToken(owner);
        await tryPutWithToken(token, true, owner);
      });

      it('does not allow a regular user to update another regular user\'s account', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await tryPutWithToken(token, false);
      });

      it('does not allow a regular user to update another "business" user\'s account', async () => {
        const token = await givenAValidToken(user);
        await tryPutWithToken(token, false, owner);
      });

      it('does not allow a "business" user to update another regular user\'s account', async () => {
        const token = await givenAValidToken(owner);
        await tryPutWithToken(token, false);
      });

      it('does not allow a "business" user to update another "business" user\'s account', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryPutWithToken(token, false, owner);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'PUT', () => `/users/${user.id}`);

      async function tryPutWithToken(token: string, expectSuccess: boolean, account = user) {
        const newName = getUniqueUserName();
        const oldName = account.name;
        await client
          .put(`/users/${account.id}`)
          .set('Authorization', 'Bearer ' + token)
          .send({
            ...account,
            name: newName,
          })
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const adminToken = await givenAValidToken(admin);
        const res = await client
          .get(`/users/${account.id}`)
          .set('Authorization', 'Bearer ' + adminToken)
          .expect(200);

        expect(res.body.name).to.equal(expectSuccess ? newName : oldName);
      }

    });

    describe('DELETE', () => {

      it('allows an admin to remove an account', async () => {
        const token = await givenAValidToken(admin);
        await tryDeleteWithToken(token, true);
      });

      it('does not allow a regular user to remove his own account', async () => {
        const token = await givenAValidToken(user);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a regular user to remove another regular user\'s account', async () => {
        const otherUser = await givenAUser();
        const token = await givenAValidToken(otherUser);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a regular user to remove another "business" user\'s account', async () => {
        const token = await givenAValidToken(user);
        await tryDeleteWithToken(token, false, owner);
      });

      it('does not allow a "business" user to remove his own account', async () => {
        const token = await givenAValidToken(owner);
        await tryDeleteWithToken(token, false, owner);
      });

      it('does not allow a "business" user to remove another regular user\'s account', async () => {
        const token = await givenAValidToken(owner);
        await tryDeleteWithToken(token, false);
      });

      it('does not allow a "business" user to remove another "business" user\'s account', async () => {
        const otherOwner = await givenAnOwner();
        const token = await givenAValidToken(otherOwner);
        await tryDeleteWithToken(token, false, owner);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'DELETE', () => `/users/${user.id}`);

      async function tryDeleteWithToken(token: string, expectSuccess: boolean, account = user) {
        await client
          .delete(`/users/${account.id}`)
          .set('Authorization', 'Bearer ' + token)
          // FIXME: 403
          .expect(expectSuccess ? 204 : 401);

        const adminToken = await givenAValidToken(admin);
        await client
          .get(`/users/${account.id}`)
          .set('Authorization', 'Bearer ' + adminToken)
          .expect(expectSuccess ? 404 : 200);
      }

    });

  });

  describe('/users/login', () => {

    describe('POST', () => {

      it('responds with a JWT token', async () => {
        const newUser = await givenAUser();

        const res = await client
          .post('/users/login')
          .send({login: newUser.name, password: userPassword})
          .expect(200);

        const token = res.body.token;
        expect(token).to.not.be.empty();
      });

      it('responds with an error when invalid login is used', async () => {
        await givenAUser();

        const res = await client
          .post('/users/login')
          .send({login: 'idontexist', password: userPassword})
          .expect(401);

        expect(res.body.error.message).to.equal('Invalid login or password.');
      });

      it('responds with an error when invalid password is used', async () => {
        const newUser = await givenAUser();

        const res = await client
          .post('/users/login')
          .send({login: newUser.name, password: 'wrongpassword'})
          .expect(401);

        expect(res.body.error.message).to.equal('Invalid login or password.');
      });

    });

  });

  describe('/users/me', () => {

    describe('GET', () => {

      it('responds with the current user profile when a valid JWT token is provided', async () => {
        const newUser = await givenAUser();
        const token = await givenAValidToken(newUser);

        const res = await client
          .get('/users/me')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);

        const userProfile = res.body;
        expect(userProfile.id).to.equal(newUser.id);
        expect(userProfile.name).to.equal(newUser.name);
        expect(userProfile.roles).to.deepEqual(newUser.roles);
      });

      itIsProtectedWithJWT(() => client, () => expiredToken, 'GET', () => '/users/me');

    });

  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createExpiredToken() {
    const newUser = await givenAUser();
    expiredToken = await givenAnExpiredToken(newUser);
  }
});
