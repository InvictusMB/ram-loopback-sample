import React, {useState} from 'react';

import {Link} from '../core';
import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function RestaurantListPage({Shell, userProfileStore}: PickInjected<typeof dependencies>) {
  const [rating, setRating] = useState(0);

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
            <Link to="/dashboard">
              <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
                My Dashboard
              </div>
            </Link>
          )}
          {isAdmin && (
            <Link to="/users">
              <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
                Users
              </div>
            </Link>
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

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
] as const;
Object.assign(RestaurantListPage, {
  route: '/restaurants',
  [Symbol.for('ram.deps')]: dependencies,
});
