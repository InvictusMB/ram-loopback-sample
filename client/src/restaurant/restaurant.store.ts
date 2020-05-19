import {computed, IReactionDisposer, observable, reaction, task} from '../core';
import {NewRestaurant, RestaurantWithRelations, UserWithRelations} from '../openapi';

export class RestaurantStore {
  @observable restaurants: Restaurant[] = [];

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
    );
  }

  @task.resolved
  async load() {
    this.restaurants = await this.restaurantService.getRestaurants();
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
