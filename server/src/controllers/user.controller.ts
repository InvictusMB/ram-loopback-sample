// Based on loopback4-example-shopping

import _ from 'lodash';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {NewUserRequest, toUser} from '../models/new-user-request.model';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {
  post,
  put,
  param,
  get,
  del,
  requestBody,
  HttpErrors,
  getModelSchemaRef,
} from '@loopback/rest';
import {User, LoginCredentials} from '../models';
import {UserRepository} from '../repositories';
import {
  roleAuthorization,
  routeAuthorization,
  PasswordHasher,
} from '../services';

import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from '../keys';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, LoginCredentials>,
  ) {}

  @get('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @post('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', {optional: true})
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    if (!currentUserProfile.roles.includes('admin')) {
      newUserRequest.roles = ['user'];
    }
    // FIXME: should be enforced by request validator
    // see https://github.com/strongloop/loopback-next/issues/4645
    newUserRequest.roles = _.uniq(newUserRequest.roles);

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );

    try {
      // FIXME: Enforced by DB, currently broken in memory DS
      const [existing] = await this.userRepository.find({where: {name: newUserRequest.login}});
      if (existing) {
        const err = new Error() as Error & {code: number, errmsg: string};
        Object.assign(err, {
          code: 11000,
          errmsg: 'index: name',
        });
        throw err;
      }

      // create the new user
      const savedUser = await this.userRepository.create(
        toUser(newUserRequest),
      );

      // set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password});

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: name')) {
        throw new HttpErrors.Conflict('User login is already taken');
      } else {
        throw error;
      }
    }
  }

  @put('/users/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['user'],
    voters: [roleAuthorization, routeAuthorization],
  })
  async set(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('userId') userId: string,
    @requestBody({description: 'update user'}) user: User,
  ): Promise<void> {
    try {
      // FIXME: should be enforced by request validator
      // see https://github.com/strongloop/loopback-next/issues/4645
      user.roles = _.uniq(user.roles);

      // Only admin can assign roles
      if (!User.isAdmin(currentUserProfile)) {
        delete user.roles;
      }
      const updatedUser = await this.userRepository.updateById(userId, user);
      return updatedUser;
    } catch (e) {
      return e;
    }
  }

  @get('/users/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['user'],
    voters: [roleAuthorization, routeAuthorization],
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [roleAuthorization],
  })
  @del('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({description: 'Login credentials'})
    credentials: LoginCredentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
