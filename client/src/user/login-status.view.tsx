import React from 'react';

export function LoginStatusView({Shell, userProfileStore, sessionStore}: PickInjected<typeof dependencies>) {
  if (userProfileStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  if (!userProfileStore.userProfile) {
    return (
      <Shell.LoginFormView />
    );
  }

  const {id = '0', name} = userProfileStore.userProfile;
  const gender = +id % 2 === 0 ? 'women' : 'men';

  return (
    <div className="w-full flex items-center">
      <img
        className="block h-8 rounded-full"
        src={'https://randomuser.me/api/portraits/' + gender + '/' + id + '.jpg'} alt="Avatar"
      />
      <div className="w-full mx-3 mb-0 py-2">
        <label className="block text-gray-500 font-bold pr-4">
          {name}
        </label>
      </div>
      <Shell.ButtonPrimary {...{
        className: 'mr-2',
        onClick: () => sessionStore.logout(),
        children: 'Sign out',
      }} />
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.sessionStore,
] as const;

Object.assign(LoginStatusView, {[Symbol.for('ram.deps')]: dependencies});
