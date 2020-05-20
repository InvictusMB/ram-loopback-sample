import fp from 'lodash/fp';
import React from 'react';

import {Link} from '../core';
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
        <Link key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
          <Shell.RestaurantSummaryView {...{
            restaurant,
          }} />
        </Link>
      ))}
      <Shell.RestaurantAddView />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(RestaurantListView, {[Symbol.for('ram.deps')]: dependencies});

type RestaurantListViewProps = PickInjected<typeof dependencies> & {
  filter?: (r: RestaurantWithRelations) => boolean
};

function avgReview(r: RestaurantWithRelations) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return 0;
  }
  return Math.round(fp.sum(ratings) / ratings.length * 10) / 10;
}
