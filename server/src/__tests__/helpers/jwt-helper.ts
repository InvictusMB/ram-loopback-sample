import {Client, expect} from '@loopback/testlab';
import {securityId} from '@loopback/security';
import {TokenServiceConstants} from '../../keys';
import {User} from '../../models';
import {JWTService} from '../../services'

export function itIsProtectedWithJWT(getClient: () => Client, getExpiredToken: () => string, verb: string, getEndpoint: () => string) {

  const method = verb.toLowerCase() as 'get' | 'post' | 'patch' | 'put';

  describe(`${verb} JWT`, () => {

    it(`${verb} responds with an error when a JWT token is not provided`, async () => {
      const res = await getClient()
        [method](getEndpoint())
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Authorization header not found.',
      );
    });

    it(`${verb} responds with an error when an invalid JWT token is provided`, async () => {
      const res = await getClient()
        [method](getEndpoint())
        .set('Authorization', 'Bearer ' + 'xxx.yyy.zzz')
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Error verifying token : invalid token',
      );
    });

    it(`${verb} responds with an error when 'Bearer ' is not found in Authorization header`, async () => {
      const res = await getClient()
        [method](getEndpoint())
        .set('Authorization', 'NotB3@r3r ' + 'xxx.yyy.zzz')
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Authorization header is not of type \'Bearer\'.',
      );
    });

    it(`${verb} responds with an error when an expired JWT token is provided`, async () => {
      const res = await getClient()
        [method](getEndpoint())
        .set('Authorization', 'Bearer ' + getExpiredToken())
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Error verifying token : jwt expired',
      );
    });

  });
}

export async function givenAValidToken(user: User) {
  const tokenService: JWTService = new JWTService(
    TokenServiceConstants.TOKEN_SECRET_VALUE,
    TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
  );
  const userProfile = {
    [securityId]: user.id,
    name: user.name,
    roles: user.roles,
  };
  return tokenService.generateToken(userProfile);
}

export async function givenAnExpiredToken(user: User) {
  const tokenService: JWTService = new JWTService(
    TokenServiceConstants.TOKEN_SECRET_VALUE,
    '-1',
  );
  const userProfile = {
    [securityId]: user.id,
    name: user.name,
  };
  return tokenService.generateToken(userProfile);
}
