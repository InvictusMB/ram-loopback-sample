import {router} from '@ram-stack/core';

export function AppView({Shell, routerRoot}: AppViewProps) {
  return (
    <div>
      <router.BrowserRouter>
        <Shell.LoginStatusView />
        <router.Switch>
          {Object.entries(routerRoot.routeConfig)
            .map(([path, id]) => {
              return ([path, Shell[id as keyof Shell]]);
            })
            .map(([path, Component]) => (
              <router.Route {...{
                key: path as string,
                path: path as string,
                exact: true,
                render: (props: any) => <Component {...props} />,
              }} />
            ))}
        </router.Switch>
      </router.BrowserRouter>
    </div>
  );
}

AppView.dependencies = [
  Injected.Shell,
  Injected.routerRoot,
];
type AppViewProps = PickInjected<typeof AppView.dependencies>;
