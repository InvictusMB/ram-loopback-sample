import React from 'react';

import {useParams} from '../core';

export function UserDetailsPage() {
  const {id} = useParams<{id: string}>();
  return (
    <div>User {id}</div>
  );
}

const dependencies = [] as const;
Object.assign(UserDetailsPage, {
  route: '/users/:id',
  [Symbol.for('ram.deps')]: dependencies,
});
