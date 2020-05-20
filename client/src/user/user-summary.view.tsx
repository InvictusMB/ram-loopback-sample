import React, {useState} from 'react';

import {useHistory} from '../core';
import {User, UserRolesEnum} from '../openapi';
import {isAllowed} from '../utils';

export function UserSummaryView(props: UserSummaryViewProps) {
  const {Shell, user, userStore, userProfileStore} = props;
  const history = useHistory();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user.name);

  const allowedRoles = [
    UserRolesEnum.Admin,
  ];
  const isEditAllowed = isAllowed(allowedRoles, userProfileStore.userProfile);

  return (
    <div className="w-full h-10 hover:bg-teal-100 flex pt-2">
      <div className="-mt-1 w-16 ml-4"><Shell.Avatar id={user.id} /></div>
      <div className="w-full ml-2 font-semibold text-gray-500">
        {!edit && user.name}
        {edit && (
          <Shell.InlineEdit {...{
            value: name,
            onChange: setName,
            onCancel: () => {
              setName(user.name);
              setEdit(false);
            },
            onAccept: async () => {
              user.name = name;
              await userStore.update(user);
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
      <Shell.RoleEdit {...{
        value: user.roles,
        onChange: async (roles: string[]) => {
          user.roles = roles as UserRolesEnum[];
          await userStore.update(user);
        },
      }} />
      <Shell.DeleteItem {...{
        error: userStore.delete.error,
        executeDelete: async () => {
          await userStore.delete(user);
          history.push('/restaurants');
        },
      }} />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userStore,
  Injected.userProfileStore,
] as const;
Object.assign(UserSummaryView, {[Symbol.for('ram.deps')]: dependencies});

type UserSummaryViewProps = PickInjected<typeof dependencies> & {
  user: User
};
