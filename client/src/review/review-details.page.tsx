import React from 'react';

import {useParams} from '../core';

export function ReviewDetailsPage() {
  const {id} = useParams<{id: string}>();
  return (
    <div>Review {id}</div>
  );
}

const dependencies = [] as const;
Object.assign(ReviewDetailsPage, {
  route: '/reviews/:id',
  [Symbol.for('ram.deps')]: dependencies,
});
