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
      <button
        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-2 text-white py-1 px-2 m-1 rounded"
        type="button"
        onClick={() => sessionStore.logout()}>
        Sign out
      </button>
    </div>
  );
}

const dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.sessionStore,
] as const;

Object.assign(LoginStatusView, {[Symbol.for('ram.deps')]: dependencies});
