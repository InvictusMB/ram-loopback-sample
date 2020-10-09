import fp from 'lodash/fp';
import {
  router,
  hooks,
} from '@ram-stack/core';

export function RestaurantDetailsPage(props: RestaurantDetailsPageProps) {
  const {Shell, restaurantStore} = props;
  const {id} = hooks.useParams<{id: string}>();

  hooks.useEffect(() => {
    if (restaurantStore.restaurantDetails?.id !== id) {
      restaurantStore.loadDetails(id).catch();
    }
  })

  const restaurant = restaurantStore.restaurantDetails;
  if (!restaurant || restaurantStore.loadDetails.pending || restaurantStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  const min = fp.orderBy(['rating', 'date'], ['asc', 'desc'], restaurant.reviews)[0];
  const max = fp.orderBy(['rating', 'date'], ['desc', 'desc'], restaurant.reviews)[0];
  return (
    <div>
      <div className="flex font-bold p-2 bg-teal-600 ">
        <div className="text-white whitespace-no-wrap">
          Restaurant details
        </div>
        <router.Link to="/restaurants">
          <div className="bg-white text-blue-400 underline rounded-full ml-4 px-4 whitespace-no-wrap">
            To List
          </div>
        </router.Link>
      </div>
      <Shell.RestaurantSummaryView {...{
        restaurant,
      }} />
      <Shell.ReviewAddView {...{
        restaurant,
      }} />
      {max && (
        <>
          <div className="flex text-white font-bold p-2 bg-teal-600 mt-4">
            <div className="whitespace-no-wrap">
              Highest rated
            </div>
          </div>
          <Shell.ReviewDetailsView {...{
            restaurant,
            review: max,
          }} />
        </>
      )}
      {min && max !== min && (
        <>
          <div className="flex text-white font-bold p-2 bg-teal-600 mt-4">
            <div className="whitespace-no-wrap">
              Lowest rated
            </div>
          </div>
          <Shell.ReviewDetailsView {...{
            restaurant,
            review: min,
          }} />
        </>
      )}
      <div className="flex text-white font-bold p-2 bg-teal-600 mt-4 justify-between">
        <div className="whitespace-no-wrap">
          Reviews
        </div>
        <Shell.ButtonRefresh {...{
          onClick: () => {
            restaurantStore.loadDetails(id).catch();
          },
        }} />
      </div>
      <Shell.ReviewListView {...{
        restaurant,
      }} />
    </div>
  );
}

RestaurantDetailsPage.route = '/restaurants/:id';
RestaurantDetailsPage.dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
];
type RestaurantDetailsPageProps = PickInjected<typeof RestaurantDetailsPage.dependencies>;
