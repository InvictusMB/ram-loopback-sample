import {
  router,
  hooks,
} from '@ram-stack/core';

import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function DashboardPage(props: DashboardPageProps) {
  const {Shell, userProfileStore, restaurantStore} = props;

  const dashboardRoles = [
    UserRolesEnum.Business,
  ];

  const isUserAllowed = isAllowed(dashboardRoles, userProfileStore.userProfile!);
  hooks.useEffect(() => {
    if (!userProfileStore.isFetching && isUserAllowed) {
      restaurantStore.loadByOwner(userProfileStore.userProfile).catch();
      restaurantStore.loadPendingReviews(userProfileStore.userProfile).catch();
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
      <router.Redirect to="/" />
    );
  }

  return (
    <div>
      <div className="flex font-bold p-2 bg-teal-600 ">
        <div className="text-white whitespace-no-wrap">
          My Restaurants
        </div>
        <router.Link to="/restaurants">
          <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">See All</div>
        </router.Link>
      </div>
      <Shell.RestaurantListView />
      <div className="flex text-white font-bold p-2 bg-teal-600 mt-4 justify-between">
        <div className="whitespace-no-wrap">
          Awaiting response
        </div>
        <Shell.ButtonRefresh {...{
          onClick: () => {
            restaurantStore.loadPendingReviews(userProfileStore.userProfile).catch();
          },
        }} />
      </div>
      <Shell.PendingResponseListView />
    </div>
  );
}

DashboardPage.route = '/dashboard';
DashboardPage.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
];
type DashboardPageProps = PickInjected<typeof DashboardPage.dependencies>;
