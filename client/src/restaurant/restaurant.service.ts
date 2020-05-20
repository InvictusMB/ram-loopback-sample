import {IReactionDisposer, qs, reaction} from '../core';
import {
  Configuration,
  NewRestaurant,
  NewReviewInRestaurant,
  Restaurant,
  RestaurantControllerApi,
  RestaurantReviewControllerApi,
} from '../openapi';

export class RestaurantService {
  restaurantApi: RestaurantControllerApi;
  reviewApi: RestaurantReviewControllerApi;
  apiService: RestaurantServiceDeps[typeof Injected.apiService];
  loginReaction: IReactionDisposer;

  constructor(deps: RestaurantServiceDeps) {
    const {sessionStore, apiService} = deps;
    this.apiService = apiService;

    this.restaurantApi = new RestaurantControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));
    this.reviewApi = new RestaurantReviewControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));

    this.loginReaction = reaction(
      () => sessionStore.session,
      (session) => {
        if (session.isLoggedIn) {
          this.restaurantApi = new RestaurantControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
          this.reviewApi = new RestaurantReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
        } else {
          this.restaurantApi = new RestaurantControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
          this.reviewApi = new RestaurantReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
        }
      },
      {fireImmediately: true},
    );
  }

  async getRestaurants() {
    return this.restaurantApi.restaurantControllerFind({
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

  async getRestaurantDetails(id: string) {
    return this.restaurantApi.restaurantControllerFindById({
      id,
      filter: {
        include: [{
          relation: 'owner',
          scope: {
            fields: ['id', 'name'] as any,
          },
        }],
      },
    });
  }

  async getRestaurantReviews(id: string) {
    return this.reviewApi.restaurantReviewControllerFind({
      id,
      filter: {
        include: [{
          relation: 'author',
          scope: {
            fields: ['id', 'name'] as any,
          },
        }, {
          relation: 'reviewResponses',
        }],
      },
    });
  }

  async createRestaurant(restaurant: NewRestaurant) {
    try {
      return await this.restaurantApi.restaurantControllerCreate({
        newRestaurant: restaurant,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async deleteRestaurant(restaurant: Restaurant) {
    try {
      await this.restaurantApi.restaurantControllerDeleteById({
        id: restaurant.id!,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async createReview(restaurant: Restaurant, review: NewReviewInRestaurant) {
    try {
      return await this.reviewApi.restaurantReviewControllerCreate({
        id: restaurant.id!,
        newReviewInRestaurant: review,
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
