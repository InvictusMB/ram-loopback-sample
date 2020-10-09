import {hooks} from '@ram-stack/core';
import type {React} from '@ram-stack/core';

import {UserRolesEnum} from '../../openapi';
import {isAllowed} from '../../utils';

import {ReactComponent as DeleteSvg} from './circle-with-cross.svg';

enum DeleteState {
  Initial = 'INITIAL',
  Requested = 'REQUESTED',
  InProgress = 'IN_PROGRESS',
}

export function DeleteItem(props: DeleteItemProps) {
  const {Shell, userProfileStore, error, executeDelete} = props;
  const [state, setState] = hooks.useState(DeleteState.Initial);

  if (!userProfileStore.userProfile) {
    return null;
  }

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  if (!isAllowed(allowedRoles, userProfileStore.userProfile)) {
    return null;
  }

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
        <Shell.ButtonAccept
          className="text-green-500 mx-1"
          onClick={async e => {
            prevent(e as React.MouseEvent);
            setState(DeleteState.InProgress);
            await executeDelete();
          }}
        />
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

DeleteItem.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
];
type DeleteItemProps = PickInjected<typeof DeleteItem.dependencies> & {
  error?: any,
  executeDelete: () => Promise<void>,
};

function prevent(e: React.MouseEvent) {
  e.preventDefault();
}
