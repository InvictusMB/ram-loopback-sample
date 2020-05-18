import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {UserDetailsPage} from './user-details.page';

test('renders user details', () => {
  // @ts-ignore
  const route = UserDetailsPage.route;
  const id = '12345';
  const {getByText} = render(
    <MemoryRouter initialEntries={[route.replace(':id', id)]}>
      <Route path={route}>
        <UserDetailsPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText(id, {exact: false});
  expect(el).toBeInTheDocument();
});
