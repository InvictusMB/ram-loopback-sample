import {computed, IReactionDisposer, observable, reaction, task} from '../core';

export class RestaurantStore {
  @observable restaurants: Restaurant[] = [];

  restaurantService: RestaurantService;
  loginReaction: IReactionDisposer;

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
