import React, {useEffect} from 'react';

import {useParams} from '../core';

export function RestaurantDetailsPage(props: PickInjected<typeof dependencies>) {
  const {Shell, restaurantStore} = props;
  const {id} = useParams<{id: string}>();

  useEffect(() => {
    if (restaurantStore.restaurantDetails?.id !== id) {
      restaurantStore.loadDetails(id).catch();
    }
  })

  const restaurant = restaurantStore.restaurantDetails;
  if (!restaurant) {
    return (
      <Shell.Spinner />
    );
  }
  return (
    <div>
      <Shell.RestaurantSummaryView {...{
        restaurant,
      }} />
      <Shell.ReviewListView {...{
        restaurant,
      }} />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(RestaurantDetailsPage, {
  route: '/restaurants/:id',
  [Symbol.for('ram.deps')]: dependencies,
});
