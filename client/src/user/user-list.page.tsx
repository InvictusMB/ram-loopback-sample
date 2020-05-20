import React, {useEffect} from 'react';
import {Link, Redirect} from '../core';
import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function UserListPage(props: PickInjected<typeof dependencies>) {
  const {Shell, userStore, userProfileStore} = props;

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  const isUserAllowed = isAllowed(allowedRoles, userProfileStore.userProfile);

  useEffect(() => {
    if (isUserAllowed && !userStore.users && !userStore.isFetching) {
      userStore.load().catch();
    }
  });

  if (userStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  if (!isUserAllowed) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div>
      <div className="flex font-bold p-2 bg-teal-600 ">
        <div className="text-white whitespace-no-wrap">
          Users
        </div>
        <Link to="/restaurants">
          <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
            To Restaurants
          </div>
        </Link>
      </div>
      {userStore.users?.map(user => (
        <Shell.UserSummaryView {...{
          key: user.id,
          user,
        }} />
      ))}
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userStore,
  Injected.userProfileStore,
] as const;
Object.assign(UserListPage, {
  route: '/users',
  [Symbol.for('ram.deps')]: dependencies,
});
