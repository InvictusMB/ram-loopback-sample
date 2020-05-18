import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {UserListPage} from './user-list.page';

test('renders user list', () => {
  // @ts-ignore
  const route = UserListPage.route;
  const {getByText} = render(
    <MemoryRouter initialEntries={[route]}>
      <Route path={route}>
        <UserListPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText('Users', {exact: false});
  expect(el).toBeInTheDocument();
});
