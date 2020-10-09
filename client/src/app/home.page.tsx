import {router} from '@ram-stack/core';

import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function HomePage(props: HomePageProps) {
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
      <router.Redirect to="/dashboard" />
    );
  }

  return (
    <router.Redirect to="/restaurants" />
  );
}

HomePage.route = '/';
HomePage.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
];
type HomePageProps = PickInjected<typeof HomePage.dependencies>;

