import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {RestaurantListPage} from './restaurant-list.page';

test('renders restaurant list', () => {
  // @ts-ignore
  const route = RestaurantListPage.route;
  const {getByText} = render(
    <MemoryRouter initialEntries={[route]}>
      <Route path={route}>
        <RestaurantListPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText('Restaurants', {exact: false});
  expect(el).toBeInTheDocument();
});
