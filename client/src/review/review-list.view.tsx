import React from 'react';
import {RestaurantWithRelations} from '../openapi/models';

export function ReviewListView({Shell, restaurantStore, restaurant}: ReviewListViewProps) {
  if (restaurantStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  if (!restaurant.reviews) {
    return null;
  }

  return (
    <div>
      {restaurant.reviews.map(review => (
        <Shell.ReviewDetailsView {...{
          key: review.id,
          review,
          restaurant,
        }} />
      ))}
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(ReviewListView, {[Symbol.for('ram.deps')]: dependencies});

type ReviewListViewProps = PickInjected<typeof dependencies> & {
  restaurant: RestaurantWithRelations
};
