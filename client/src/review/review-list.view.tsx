import fp from 'lodash/fp';
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

  const sorted = fp.orderBy(['date'], ['desc'], restaurant.reviews);
  return (
    <div>
      {sorted.map(review => (
        <Shell.ReviewDetailsView {...{
          key: review.id,
          review,
          restaurant,
        }} />
      ))}
    </div>
  );
}

ReviewListView.dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
];
type ReviewListViewProps = {
  restaurant: RestaurantWithRelations
} & PickInjected<typeof ReviewListView.dependencies>;
