import fp from 'lodash/fp';

import {IReactionDisposer, qs, reaction} from '../core';
import {
  Configuration,
  NewRestaurant,
  NewReviewInRestaurant,
  NewReviewResponseInReview,
  Restaurant,
  RestaurantControllerApi,
  RestaurantReviewControllerApi,
  Review,
  ReviewControllerApi,
  ReviewResponse,
  ReviewResponseControllerApi,
  ReviewWithRelations,
  User,
} from '../openapi';

export class RestaurantService {
  restaurantApi: RestaurantControllerApi;
  restaurantReviewApi: RestaurantReviewControllerApi;
  reviewApi: ReviewControllerApi;
  reviewResponseApi: ReviewResponseControllerApi;
  apiService: RestaurantServiceDeps[typeof Injected.apiService];
  loginReaction: IReactionDisposer;

  constructor(deps: RestaurantServiceDeps) {
    const {sessionStore, apiService} = deps;
    this.apiService = apiService;

    this.restaurantApi = new RestaurantControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));
    this.restaurantReviewApi = new RestaurantReviewControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));
    this.reviewApi = new ReviewControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));
    this.reviewResponseApi = new ReviewResponseControllerApi(new Configuration({
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
          this.restaurantReviewApi = new RestaurantReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
          this.reviewApi = new ReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
          this.reviewResponseApi = new ReviewResponseControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token,
          }));
        } else {
          this.restaurantApi = new RestaurantControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
          this.restaurantReviewApi = new RestaurantReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
          this.reviewApi = new ReviewControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
          }));
          this.reviewResponseApi = new ReviewResponseControllerApi(new Configuration({
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

  async getRestaurantsByOwner(owner: User) {
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
        where: {
          ownerId: {
            eq: owner.id,
          },
        },
      },
    });
  }

  async getPendingReviewsForOwner(owner: User) {
    const response = await this.reviewApi.reviewControllerFind({
      filter: {
        include: [{
          relation: 'author',
        }, {
          relation: 'restaurant',
        }, {
          relation: 'reviewResponses',
        }],
      },
    });
    const filter = fp.filter<any>(r => (
      r.restaurant.ownerId === owner.id && !r.reviewResponses
    ));
    return filter(response) as ReviewWithRelations[];
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
    return this.restaurantReviewApi.restaurantReviewControllerFind({
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

  async updateRestaurant(restaurant: Restaurant) {
    try {
      await this.restaurantApi.restaurantControllerReplaceById({
        id: restaurant.id!,
        restaurant,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async createReview(restaurant: Restaurant, review: NewReviewInRestaurant) {
    try {
      return await this.restaurantReviewApi.restaurantReviewControllerCreate({
        id: restaurant.id!,
        newReviewInRestaurant: review,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async deleteReview(review: Review) {
    try {
      await this.reviewApi.reviewControllerDeleteById({
        id: review.id!,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async updateReview(review: Review) {
    try {
      await this.reviewApi.reviewControllerReplaceById({
        id: review.id!,
        review,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async createReviewResponse(review: Review, response: NewReviewResponseInReview) {
    try {
      return await this.reviewResponseApi.reviewResponseControllerCreate({
        id: review.id!,
        newReviewResponseInReview: response,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async deleteReviewResponse(response: ReviewResponse) {
    try {
      await this.reviewResponseApi.reviewResponseControllerDelete({
        id: response.id!,
      });
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  }

  async updateReviewResponse(review: Review, response: ReviewResponse) {
    try {
      await this.reviewResponseApi.reviewResponseControllerDelete({
        id: review.id!,
      });
      return await this.reviewResponseApi.reviewResponseControllerCreate({
        id: review.id!,
        newReviewResponseInReview: response,
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
