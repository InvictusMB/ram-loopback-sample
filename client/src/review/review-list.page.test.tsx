import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {ReviewListPage} from './review-list.page';

test('renders review list', () => {
  // @ts-ignore
  const route = ReviewListPage.route;
  const {getByText} = render(
    <MemoryRouter initialEntries={[route]}>
      <Route path={route}>
        <ReviewListPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText('Reviews', {exact: false});
  expect(el).toBeInTheDocument();
});
