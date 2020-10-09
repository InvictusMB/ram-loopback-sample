import {
  router,
  hooks,
} from '@ram-stack/core';

import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function RestaurantListPage({Shell, userProfileStore}: RestaurantListPageProps) {
  const [rating, setRating] = hooks.useState(0);

  const dashboardRoles = [
    UserRolesEnum.Business,
  ];

  const isOwner = isAllowed(dashboardRoles, userProfileStore.userProfile!);

  const userListRoles = [
    UserRolesEnum.Admin,
  ];

  const isAdmin = isAllowed(userListRoles, userProfileStore.userProfile!);

  return (
    <div>
      <div className="flex justify-between bg-teal-600 text-white">
        <div className="font-bold p-2 flex">
          <div>Restaurants</div>
          {isOwner && (
            <router.Link to="/dashboard">
              <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
                My Dashboard
              </div>
            </router.Link>
          )}
          {isAdmin && (
            <router.Link to="/users">
              <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
                Users
              </div>
            </router.Link>
          )}
        </div>
        <div className="px-2 self-center flex">
          <Shell.RatingEdit {...{
            value: rating,
            onChange: setRating,
          }} />
          <Shell.ButtonCancel {...{
            className: 'mx-2 text-white mt-1',
            onClick: () => setRating(0),
          }} />
        </div>
      </div>
      <Shell.RestaurantListView {...{
        filter: (r: any) => r.rating >= rating,
      }} />
    </div>
  );
}

RestaurantListPage.route = '/restaurants';
RestaurantListPage.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
];
type RestaurantListPageProps = PickInjected<typeof RestaurantListPage.dependencies>;
