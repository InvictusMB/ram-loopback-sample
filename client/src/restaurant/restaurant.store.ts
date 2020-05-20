import {computed, IReactionDisposer, observable, reaction, task} from '../core';
import {NewRestaurant, RestaurantWithRelations, ReviewWithRelations, UserWithRelations} from '../openapi';

export class RestaurantStore {
  @observable restaurants: Restaurant[] = [];
  @observable restaurantDetails?: Restaurant;

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
    await this.load();
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

  createReviewResponse = task.resolved(async (review, response) => {
    const created = await this.restaurantService.createReviewResponse(review, response);
    review.reviewResponses = [created];
    return created;
  });

  load = task.resolved(async () => {
    this.restaurants = await this.restaurantService.getRestaurants();
  });

  loadByOwner = task.resolved(async (owner) => {
    this.restaurants = await this.restaurantService.getRestaurantsByOwner(owner);
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
