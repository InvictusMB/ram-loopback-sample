import React from 'react';
import {Link} from '../core';

export function RestaurantListView({Shell, restaurantStore}: RestaurantListViewProps) {
  const {restaurants} = restaurantStore;

  return (
    <div>
      {restaurants.map(restaurant => (
        <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
          <Shell.RestaurantSummaryView {...{
            restaurant,
          }} />
        </Link>
      ))}
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(RestaurantListView, {[Symbol.for('ram.deps')]: dependencies});

type RestaurantListViewProps = PickInjected<typeof dependencies>;
