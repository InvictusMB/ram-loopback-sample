import React from 'react';

export function RestaurantListPage({Shell}: PickInjected<typeof dependencies>) {
  return (
    <div>
      <div>Restaurants</div>
      <Shell.RestaurantListView />
    </div>
  );
}

const dependencies = [Injected.Shell] as const;
Object.assign(RestaurantListPage, {
  route: '/restaurants',
  [Symbol.for('ram.deps')]: dependencies,
});
