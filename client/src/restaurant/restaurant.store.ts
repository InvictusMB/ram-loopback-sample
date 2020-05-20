import fp from 'lodash/fp';

import {computed, IReactionDisposer, observable, reaction, task} from '../core';
import {
  NewRestaurant,
  RestaurantWithRelations,
  ReviewResponse,
  ReviewWithRelations,
  UserWithRelations,
} from '../openapi';

export class RestaurantStore {
  @observable restaurants: Restaurant[] = [];
  @observable restaurantDetails?: Restaurant;
  @observable pendingReviews: ReviewWithRelations[] = [];

  restaurantService: RestaurantService;
  loginReaction: IReactionDisposer;

  create = task.resolved(async (owner: UserWithRelations, restaurant: NewRestaurant) => {
    const created: RestaurantWithRelations = await this.restaurantService.createRestaurant(restaurant);
    created.owner = owner;
    this.restaurants.push(created);
    return created;
  });

  delete = task.resolved(async (restaurant: Restaurant) => {
    await this.restaurantService.deleteRestaurant(restaurant);
    this.restaurants = fp.filter(r => r.id !== restaurant.id, this.restaurants);
  });

  update = task.resolved(async (restaurant: Restaurant) => {
    await this.restaurantService.updateRestaurant(restaurant);
  });

  loadDetails = task.resolved(async (restaurantId: string) => {
    this.restaurantDetails = await this.restaurantService.getRestaurantDetails(restaurantId);
    this.restaurantDetails.reviews = await this.restaurantService.getRestaurantReviews(restaurantId);
  });

  createReview = task.resolved(async (author, restaurant, review) => {
    const created: ReviewWithRelations = await this.restaurantService.createReview(restaurant, review);
    const current = this.restaurantDetails;
    created.author = author;
    if (current && current.id === restaurant.id) {
      current.reviews = current.reviews || [];
      current.reviews.push(created);
    }
    return created;
  });

  deleteReview = task.resolved(async (review) => {
    await this.restaurantService.deleteReview(review);
    if (!this.restaurantDetails) {
      return;
    }
    const reviews = this.restaurantDetails.reviews;
    this.restaurantDetails.reviews = fp.filter(r => r.id !== review.id, reviews);
  });

  updateReview = task.resolved(async (review) => {
    await this.restaurantService.updateReview(review);
  });

  deleteReviewResponse = task.resolved(async (review: ReviewWithRelations, response: ReviewResponse) => {
    await this.restaurantService.deleteReviewResponse(response);
    review.reviewResponses = [];
  });

  createReviewResponse = task.resolved(async (review, response) => {
    const created = await this.restaurantService.createReviewResponse(review, response);
    review.reviewResponses = [created];
    return created;
  });

  updateReviewResponse = task.resolved(async (review, response) => {
    await this.restaurantService.updateReviewResponse(review, response);
  });

  load = task.resolved(async () => {
    this.restaurants = await this.restaurantService.getRestaurants();
  });

  loadByOwner = task.resolved(async (owner) => {
    this.restaurants = await this.restaurantService.getRestaurantsByOwner(owner);
  });

  loadPendingReviews = task.resolved(async (owner) => {
    const reviews = await this.restaurantService.getPendingReviewsForOwner(owner);
    this.pendingReviews = fp.map(r => {
      r.restaurant = fp.find({id: r.restaurantId}, this.restaurants);
      return r;
    }, reviews);
  });

  constructor({sessionStore, restaurantService}: RestaurantStoreDeps) {
    this.restaurantService = restaurantService;
    this.loginReaction = reaction(
      () => sessionStore.session,
      async (session) => {
        await this.load();
      },
      {fireImmediately: true},
    );
  }

  @computed get isFetching() {
    return (
      // @ts-ignore
      this.load.pending
      || this.loadDetails.pending
    );
  }

  reset() {
    this.restaurants = [];
  }
}

const dependencies = [
  Injected.apiService,
  Injected.restaurantService,
  Injected.sessionStore,
] as const;
type RestaurantStoreDeps = PickInjected<typeof dependencies>;

type RestaurantService = RestaurantStoreDeps[typeof Injected.restaurantService];
type Restaurant = UnwrapAsync<RestaurantService['getRestaurants']>[number];
