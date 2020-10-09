export function LoginStatusView({Shell, userProfileStore, sessionStore}: LoginStatusViewProps) {
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

  const {id, name} = userProfileStore.userProfile;

  return (
    <div className="w-full flex items-center">
      <Shell.Avatar id={id} />
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

LoginStatusView.dependencies = [
  Injected.Shell,
  Injected.userProfileStore,
  Injected.sessionStore,
];
type LoginStatusViewProps = PickInjected<typeof LoginStatusView.dependencies>;
