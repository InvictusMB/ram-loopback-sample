import {
  IReactionDisposer,
  reaction,
} from '@ram-stack/core';

import {
  Configuration,
  NewUser,
  User,
  UserControllerApi,
} from '../openapi';
import {qs} from '../utils';

export class UserService {
  static dependencies = [
    Injected.apiService,
    Injected.sessionStore,
  ];

  userApi: UserControllerApi;
  apiService: Injected.classes.ApiService;
  loginReaction: IReactionDisposer;

  constructor(deps: UserServiceDeps) {
    const {sessionStore, apiService} = deps;
    this.apiService = apiService;

    this.userApi = new UserControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));

    this.loginReaction = reaction(
      () => sessionStore.session,
      (session) => {
        if (session.isLoggedIn) {
          this.userApi = new UserControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
        } else {
          this.userApi = new UserControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
        }
      },
      {fireImmediately: true},
    );
  }

  async getUsers() {
    return this.userApi.userControllerFind({});
  }

  async createUser(user: NewUser) {
    try {
      return await this.userApi.userControllerCreate({
        newUser: user,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async deleteUser(user: User) {
    try {
      await this.userApi.userControllerDeleteById({
        id: user.id!,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async updateUser(user: User) {
    try {
      await this.userApi.userControllerSet({
        userId: user.id!,
        user,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      if (error.message === 'SyntaxError: Unexpected end of JSON input') {
        return;
      }
      return Promise.reject(error);
    }
  }
}


type UserServiceDeps = PickInjected<typeof UserService.dependencies>;
