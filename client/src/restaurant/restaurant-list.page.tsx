import React from 'react';

export function RestaurantListPage() {
  return (
    <div>Restaurants</div>
  );
}

const dependencies = [] as const;
Object.assign(RestaurantListPage, {
  route: '/restaurants',
  [Symbol.for('ram.deps')]: dependencies,
});
