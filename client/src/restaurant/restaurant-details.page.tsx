import React from 'react';

import {useParams} from '../core';

export function RestaurantDetailsPage() {
  const {id} = useParams<{id: string}>();

  return (
    <div>Restaurant {id}</div>
  );
}

const dependencies = [] as const;
Object.assign(RestaurantDetailsPage, {
  route: '/restaurants/:id',
  [Symbol.for('ram.deps')]: dependencies,
});
