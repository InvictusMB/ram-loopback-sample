import {
  router,
  hooks,
} from '@ram-stack/core';

import {UserRolesEnum} from '../openapi/models';
import {isAllowed} from '../utils';

export function UserListPage(props: UserListPageProps) {
  const {Shell, userStore, userProfileStore} = props;

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  const isUserAllowed = isAllowed(allowedRoles, userProfileStore.userProfile);

  hooks.useEffect(() => {
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
      <router.Redirect to="/" />
    );
  }

  return (
    <div>
      <div className="flex font-bold p-2 bg-teal-600 ">
        <div className="text-white whitespace-no-wrap">
          Users
        </div>
        <router.Link to="/restaurants">
          <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
            To Restaurants
          </div>
        </router.Link>
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

UserListPage.route = '/users';
UserListPage.dependencies = [
  Injected.Shell,
  Injected.userStore,
  Injected.userProfileStore,
];
type UserListPageProps = PickInjected<typeof UserListPage.dependencies>;
