import React, {useState} from 'react';
import _ from 'lodash';

import {UserRolesEnum} from '../openapi';
import {isAllowed} from '../utils';

export function RestaurantAddView(props: RestaurantAddViewProps) {
  const {Shell, userProfileStore, restaurantStore} = props;
  const [name, setName] = useState('');

  if (!userProfileStore.userProfile) {
    return null;
  }

  const allowedRoles = [
    UserRolesEnum.Admin,
    UserRolesEnum.Business,
  ];
  if (!isAllowed(allowedRoles, userProfileStore.userProfile)) {
    return null;
  }
  const errors = extractMessages(restaurantStore.create.error);

  const owner = userProfileStore.userProfile;
  const {id: ownerId, name: ownerName} = owner;

  if (restaurantStore.create.pending) {
    return (
      <Shell.Spinner />
    );
  }

  return (
    <>
      <div className="w-full h-10 flex pt-2">
        <div className="w-full pr-6 pb-2 pl-4 font-semibold text-gray-500">
          <div className="border-b border-b-2 border-teal-500">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Restaurant Name"
              placeholder="Restaurant Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="-mt-1 -ml-3 w-16"><Shell.Avatar id={ownerId} /></div>
        <div className="w-1/6 text-center text-gray-500 font-bold">{ownerName}</div>
        <div className="w-4/6 flex justify-end">
          <Shell.ButtonPrimary {...{
            className: 'mt-0 mb-0 flex-shrink-0',
            onClick: async () => {
              await restaurantStore.create(owner, {name, ownerId}).catch();
              setName('');
            },
            children: 'Create',
          }} />
          <Shell.ButtonSecondary {...{
            className: 'mr-2 mt-0 mb-0 flex-shrink-0',
            onClick: () => setName(''),
            children: 'Clear',
          }} />
        </div>
      </div>
      {errors.map((e, i) => (
        <p className="text-red-500 text-xs italic px-3" key={i}>{e}</p>
      ))}
    </>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.restaurantStore,
] as const;
Object.assign(RestaurantAddView, {[Symbol.for('ram.deps')]: dependencies});

type RestaurantAddViewProps = PickInjected<typeof dependencies>;

type Restaurant = RestaurantStore['restaurants'][number];
type RestaurantStore = PickInjected<[typeof Injected.restaurantStore]>[typeof Injected.restaurantStore];

function extractMessages(e: any): string[] {
  if (!e) {
    return [];
  }
  const details = e.details;
  try {
    return _.flatMap(
      _.entries(details?.messages),
      ([k, errors]) => {
        return _.map(errors as any[], e => `${details.context} ${k} ${e}`);
      },
    );
  } catch (e) {
  }
  if (e.message) {
    return [e.message];
  }
  return ['Login failed'];
}

