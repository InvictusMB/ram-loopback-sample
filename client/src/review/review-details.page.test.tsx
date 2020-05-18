import {render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

import '../ram-context';
import {Route} from '../core';

import {ReviewDetailsPage} from './review-details.page';

test('renders review details', () => {
  // @ts-ignore
  const route = ReviewDetailsPage.route;
  const id = '12345';
  const {getByText} = render(
    <MemoryRouter initialEntries={[route.replace(':id', id)]}>
      <Route path={route}>
        <ReviewDetailsPage />
      </Route>
    </MemoryRouter>,
  );
  const el = getByText(id, {exact: false});
  expect(el).toBeInTheDocument();
});
