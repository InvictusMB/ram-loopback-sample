import {IReactionDisposer, reaction, qs} from '../core';
import {Configuration, RestaurantControllerApi} from '../openapi';

export class RestaurantService {
  restApi: RestaurantControllerApi;
  loginReaction: IReactionDisposer;

  constructor({sessionStore}: RestaurantServiceDeps) {
    this.restApi = new RestaurantControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));

    this.loginReaction = reaction(
      () => sessionStore.session,
      (session) => {
        if (session.isLoggedIn) {
          this.restApi = new RestaurantControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
        } else {
          this.restApi = new RestaurantControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
        }
      },
      {fireImmediately: true},
    );
  }

  async getRestaurants() {
    return this.restApi.restaurantControllerFind({
      filter: {
        include: [{
          relation: 'owner',
          scope: {
            fields: ['id', 'name'] as any,
          },
        }, {
          relation: 'reviews',
        }],
      },
    });
  }
}

const dependencies = [
  Injected.sessionStore,
] as const;
type RestaurantServiceDeps = PickInjected<typeof dependencies>;
