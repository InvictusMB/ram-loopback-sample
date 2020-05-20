import React, {useEffect} from 'react';
import {Link, Redirect} from '../core';
import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function DashboardPage(props: PickInjected<typeof dependencies>) {
  const {Shell, userProfileStore, restaurantStore} = props;

  const dashboardRoles = [
    UserRolesEnum.Business,
  ];

  const isUserAllowed = isAllowed(dashboardRoles, userProfileStore.userProfile!);
  useEffect(() => {
    if (!userProfileStore.isFetching && isUserAllowed) {
      restaurantStore.loadByOwner(userProfileStore.userProfile).catch();
    }
    return () => {
      restaurantStore.load().catch();
    };
  });

  if (userProfileStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  if (!isAllowed(dashboardRoles, userProfileStore.userProfile!)) {
    return (
      <Redirect to="/" />
    );
  }


  return (
    <div>
      <div className="flex font-bold p-2 bg-teal-600 ">
        <div className="text-white whitespace-no-wrap">
          My Restaurants
        </div>
        <Link to="/restaurants">
          <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">See All</div>
        </Link>
      </div>
      <Shell.RestaurantListView />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
] as const;
Object.assign(DashboardPage, {
  route: '/dashboard',
  [Symbol.for('ram.deps')]: dependencies,
});
