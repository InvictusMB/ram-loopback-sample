import React from 'react';

export function UserListPage() {
  return (
    <div>Users</div>
  );
}

const dependencies = [] as const;
Object.assign(UserListPage, {
  route: '/users',
  [Symbol.for('ram.deps')]: dependencies,
});
