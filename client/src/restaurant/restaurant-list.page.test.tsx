import {router} from '@ram-stack/core';
import {render} from '@testing-library/react';

import '../ram-context';

import {RestaurantListPage} from './restaurant-list.page';

test('renders restaurant list', () => {
  // @ts-ignore
  const route = RestaurantListPage.route;
  const {getByText} = render(
    <router.MemoryRouter initialEntries={[route]}>
      <router.Route path={route}>
        <RestaurantListPage {...{
          Shell: {
            RestaurantListView: () => null,
            RatingEdit: () => null,
            ButtonCancel: () => null,
          } as any,
          userProfileStore: {
            userProfile: {},
          } as any,
        }} />
      </router.Route>
    </router.MemoryRouter>,
  );
  const el = getByText('Restaurants', {exact: false});
  expect(el).toBeInTheDocument();
});
