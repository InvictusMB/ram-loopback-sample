import {hooks} from '@ram-stack/core';
import _ from 'lodash';

import {RestaurantWithRelations, UserRolesEnum} from '../openapi';
import {isAllowed} from '../utils';

import {ReactComponent as ReviewSvg} from './news-paper.svg';
import {ReactComponent as TopSvg} from './align-top.svg';
import {ReactComponent as BottomSvg} from './align-bottom.svg';

export function RestaurantSummaryView(props: RestaurantSummaryViewProps) {
  const {Shell, restaurant, restaurantStore, userProfileStore} = props;
  const history = hooks.useHistory();
  const [edit, setEdit] = hooks.useState(false);
  const [name, setName] = hooks.useState(restaurant.name);

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  const isEditAllowed = isAllowed(allowedRoles, userProfileStore.userProfile);

  return (
    <div className="w-full h-10 hover:bg-teal-100 flex pt-2">
      <div className="w-full pl-4 font-semibold text-gray-500">
        {!edit && restaurant.name}
        {edit && (
          <Shell.InlineEdit {...{
            value: name,
            onChange: setName,
            onCancel: () => {
              setName(restaurant.name);
              setEdit(false);
            },
            onAccept: async () => {
              restaurant.name = name;
              await restaurantStore.update(restaurant);
              setEdit(false);
            },
          }} />
        )}
        {isEditAllowed && !edit && (
          <Shell.ButtonEdit {...{
            className: 'ml-2',
            onClick: e => {
              e.preventDefault();
              setEdit(true);
            },
          }} />
        )}
      </div>
      <div className="-mt-1 w-16"><Shell.Avatar id={restaurant.ownerId} /></div>
      <div className="w-1/6 text-center text-gray-500 font-bold ml-2">{restaurant.owner?.name}</div>
      <div className="w-1/6 justify-center flex ml-4">
        <ReviewIcon />
        <div className="ml-2 font-bold">{restaurant.reviews?.length || 0}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <Shell.StarIcon className="text-yellow-500" />
        <div className="ml-2 font-bold">{avgReview(restaurant)}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <MaxIcon />
        <div className="ml-2 font-bold">{maxReview(restaurant)}</div>
      </div>
      <div className="w-1/6 flex justify-center">
        <MinIcon />
        <div className="ml-2 font-bold">{minReview(restaurant)}</div>
      </div>
      <Shell.DeleteItem {...{
        error: restaurantStore.delete.error,
        executeDelete: async () => {
          await restaurantStore.delete(restaurant);
          history.push('/restaurants');
        },
      }} />
    </div>
  );
}

function ReviewIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <ReviewSvg stroke="currentColor" />
    </div>
  );
}

function MaxIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <TopSvg stroke="currentColor" />
    </div>
  );
}

function MinIcon() {
  return (
    <div className="inline-block h-4 w-4 text-blue-400 mt-1">
      <BottomSvg stroke="currentColor" />
    </div>
  );
}

RestaurantSummaryView.dependencies = [
  Injected.Shell,
  Injected.restaurantStore,
  Injected.userProfileStore,
];
type RestaurantSummaryViewProps = {
  restaurant: RestaurantWithRelations
} & PickInjected<typeof RestaurantSummaryView.dependencies>;


function maxReview(r: RestaurantWithRelations) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.max(...ratings);
}

function minReview(r: RestaurantWithRelations) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.min(...ratings);
}

function avgReview(r: RestaurantWithRelations) {
  const ratings = (r.reviews ?? []).map(rv => rv.rating);
  if (!ratings.length) {
    return '-';
  }
  return Math.round(_.sum(ratings) / ratings.length * 10) / 10;
}
