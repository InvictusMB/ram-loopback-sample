import React from 'react';

export function PendingResponseListView({Shell, restaurantStore}: ReviewListViewProps) {
  if (restaurantStore.loadPendingReviews.pending) {
    return (
      <Shell.Spinner />
    );
  }

  const reviews = restaurantStore.pendingReviews;
  if (!reviews?.length) {
    return (
      <div className="font-semibold text-teal-600 p-2">
        No new reviews
      </div>
    );
  }

  return (
    <div>
      {reviews.map(review => (
        <Shell.ReviewDetailsView {...{
          key: review.id,
          review,
          restaurant: review.restaurant!,
        }} />
      ))}
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
] as const;
Object.assign(PendingResponseListView, {[Symbol.for('ram.deps')]: dependencies});

type ReviewListViewProps = PickInjected<typeof dependencies>;
