import React, {useState} from 'react';

import {useHistory} from '../core';
import {Restaurant, UserRolesEnum} from '../openapi';
import {isAllowed} from '../utils';

import {ReactComponent as DeleteSvg} from './circle-with-cross.svg';
import {ReactComponent as ConfirmSvg} from './check.svg';

enum DeleteState {
  Initial = 'INITIAL',
  Requested = 'REQUESTED',
  InProgress = 'IN_PROGRESS',
}

export function RestaurantDeleteView(props: RestaurantDeleteViewProps) {
  const {Shell, userProfileStore, restaurantStore, restaurant} = props;
  const [state, setState] = useState(DeleteState.Initial);

  const history = useHistory();

  if (!userProfileStore.userProfile) {
    return null;
  }

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  if (!isAllowed(allowedRoles, userProfileStore.userProfile)) {
    return null;
  }

  const error = restaurantStore.delete.error;

  if (state === DeleteState.InProgress && !error) {
    return (
      <div className="w-1/6 -mt-3">
        <Shell.Spinner />
      </div>
    );
  }
  if (state === DeleteState.InProgress) {
    return (
      <div className="w-1/6 flex justify-evenly flex-row">
        <p className="text-red-500 italic flex-shrink-0">{'Error!'}</p>
        <Shell.ButtonCancel {...{
          onClick: (e: React.MouseEvent) => {
            prevent(e);
            setState(DeleteState.Initial);
          },
        }} />
      </div>
    );
  }

  if (state === DeleteState.Initial) {
    return (
      <div className="w-1/6 flex justify-center">
        <button
          className="transition delay-200 duration-200 ease-in-out transform hover:scale-150"
          onClick={e => {
            prevent(e);
            setState(DeleteState.Requested);
          }}
        >
          <DeleteIcon />
        </button>
      </div>
    );
  }
  if (state === DeleteState.Requested) {
    return (
      <div className="w-1/6 flex justify-evenly">
        <button
          className="transition duration-200 ease-in-out transform hover:scale-150"
          onClick={async e => {
            prevent(e);
            setState(DeleteState.InProgress);
            await restaurantStore.delete(restaurant).catch();
            history.push(`/restaurants`);
          }}
        >
          <ConfirmIcon />
        </button>
        <Shell.ButtonCancel {...{
          onClick: (e: React.MouseEvent) => {
            prevent(e);
            setState(DeleteState.Initial);
          },
        }} />
      </div>

    );
  }
  return null;
}

function DeleteIcon() {
  return (
    <div className="inline-block w-6 h-6 text-red-500">
      <DeleteSvg className="stroke-current fill-current" />
    </div>
  );
}

function ConfirmIcon() {
  return (
    <div className="inline-block h-4 w-4 text-green-500">
      <ConfirmSvg stroke="currentColor" />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
] as const;
Object.assign(RestaurantDeleteView, {[Symbol.for('ram.deps')]: dependencies});

type RestaurantDeleteViewProps = PickInjected<typeof dependencies> & {
  restaurant: Restaurant
};

function prevent(e: React.MouseEvent) {
  e.preventDefault();
}
