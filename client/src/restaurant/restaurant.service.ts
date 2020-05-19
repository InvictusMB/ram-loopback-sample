import {IReactionDisposer, reaction, qs} from '../core';
import {Configuration, NewRestaurant, Restaurant, RestaurantControllerApi} from '../openapi';

export class RestaurantService {
  restApi: RestaurantControllerApi;
  apiService: RestaurantServiceDeps[typeof Injected.apiService];
  loginReaction: IReactionDisposer;

  constructor(deps: RestaurantServiceDeps) {
    const {sessionStore, apiService} = deps;
    this.apiService = apiService;

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

  async createRestaurant(restaurant: NewRestaurant) {
    try {
      return await this.restApi.restaurantControllerCreate({
        newRestaurant: restaurant,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async deleteRestaurant(restaurant: Restaurant) {
    try {
      await this.restApi.restaurantControllerDeleteById({
        id: restaurant.id!,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }
}

const dependencies = [
  Injected.apiService,
  Injected.sessionStore,
] as const;
type RestaurantServiceDeps = PickInjected<typeof dependencies>;
