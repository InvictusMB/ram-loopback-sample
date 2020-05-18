import React from 'react';

export function ReviewListPage() {
  return (
    <div>Reviews</div>
  );
}

const dependencies = [] as const;
Object.assign(ReviewListPage, {
  route: '/reviews',
  [Symbol.for('ram.deps')]: dependencies,
});
