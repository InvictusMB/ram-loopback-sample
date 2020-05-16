import {ServerApplication} from '../../application';
import {Restaurant, User} from '../../models';
import {RestaurantRepository} from '../../repositories';

let count = 0;

export async function createARestaurant(app: ServerApplication, owner: User): Promise<Restaurant> {
  const restaurantRepo: RestaurantRepository = await app.get('repositories.RestaurantRepository');

  return restaurantRepo.create({
    name: getUniqueRestaurantName(),
    ownerId: owner.id,
  });
}


export function getUniqueRestaurantName() {
  return 'restaurant' + (++count);
}
