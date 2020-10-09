import fp from 'lodash/fp';
import {router} from '@ram-stack/core';

import {RestaurantWithRelations} from '../openapi/models';

export function RestaurantListView({Shell, restaurantStore, filter}: RestaurantListViewProps) {
  const {restaurants} = restaurantStore;

  if (restaurantStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  const restaurantsWithRating = fp.flow([
    fp.map((r: RestaurantWithRelations) => Object.assign(r, {
      rating: avgReview(r),
    })),
    fp.filter(filter ?? fp.constant(true)),
    fp.orderBy(['rating'], ['desc']),
  ])(restaurants) as RestaurantWithRelations[];

  return (
    <div>
      {restaurantsWithRating.map(restaurant => (
        <router.Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
          <Shell.RestaurantSummaryView {...{
            restaurant,
          }} />
        </router.Link>
      ))}
      <Shell.RestaurantAddView />
    </div>
  );
}

RestaurantListView.dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
];
type RestaurantListViewProps = {
  filter?: (r: RestaurantWithRelations) => boolean
} & PickInjected<typeof RestaurantListView.dependencies>;

function avgReview(r: RestaurantWithRelations) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return 0;
  }
  return Math.round(fp.sum(ratings) / ratings.length * 10) / 10;
}
