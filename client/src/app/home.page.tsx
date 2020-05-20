import React from 'react';
import {Redirect} from '../core';
import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function HomePage(props: PickInjected<typeof dependencies>) {
  const {Shell, userProfileStore} = props;

  if (userProfileStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }
  const dashboardRoles = [
    UserRolesEnum.Business,
  ];
  if (isAllowed(dashboardRoles, userProfileStore.userProfile!)) {
    return (
      <Redirect to="/dashboard" />
    );
  }

  return (
    <Redirect to="/restaurants" />
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
] as const;
Object.assign(HomePage, {
  route: '/',
  [Symbol.for('ram.deps')]: dependencies,
});

