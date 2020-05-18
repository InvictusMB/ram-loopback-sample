import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {RestaurantDetailsPage} from './restaurant-details.page';

test('renders restaurant details', () => {
  // @ts-ignore
  const route = RestaurantDetailsPage.route;
  const id = '12345';
  const {getByText} = render(
    <MemoryRouter initialEntries={[route.replace(':id', id)]}>
      <Route path={route}>
        <RestaurantDetailsPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText(id, {exact: false});
  expect(el).toBeInTheDocument();
});