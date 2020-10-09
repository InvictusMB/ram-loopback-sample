import {router} from '@ram-stack/core';
import {render} from '@testing-library/react';

import '../ram-context';

import {RestaurantDetailsPage} from './restaurant-details.page';

test('renders restaurant details', () => {
  // @ts-ignore
  const route = RestaurantDetailsPage.route;
  const id = '12345';
  const {getByText} = render(
    <router.MemoryRouter initialEntries={[route.replace(':id', id)]}>
      <router.Route path={route}>
        <RestaurantDetailsPage {...{
          Shell: {
            RestaurantSummaryView: ({restaurant}: any) => <div>{restaurant.id}</div>,
            ReviewAddView: () => null,
            ReviewDetailsView: () => null,
            ReviewListView: () => null,
            ButtonRefresh: () => null,
            Spinner: () => null,
          } as any,
          restaurantStore: {
            restaurantDetails: {id},
            loadDetails: async () => null,
          } as any,
        }} />
      </router.Route>
    </router.MemoryRouter>,
  );
  const el = getByText(id, {exact: false});
  expect(el).toBeInTheDocument();
});
