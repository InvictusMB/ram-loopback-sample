import {router} from '@ram-stack/core';
import {render} from '@testing-library/react';

import '../ram-context';

import {UserListPage} from './user-list.page';

test('renders user list', () => {
  // @ts-ignore
  const route = UserListPage.route;
  const {getByText} = render(
    <router.MemoryRouter initialEntries={[route]}>
      <router.Route path={route}>
        <UserListPage {...{
          Shell: {
          } as any,
          userStore: {
            users: [],
            load: () => Promise.resolve(),
          } as any,
          userProfileStore: {
            userProfile: {
              roles: ['admin']
            }
          } as any
        }} />
      </router.Route>
    </router.MemoryRouter>,
  );
  const el = getByText('Users', {exact: false});
  expect(el).toBeInTheDocument();
});
