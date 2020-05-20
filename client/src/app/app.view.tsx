import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {Route, Switch} from '../core';

export const AppView = ({Shell, router}: PickInjected<typeof dependencies>) => {
  return (
    <div>
      <Router>
        <Shell.LoginStatusView />
        <Switch>
          {Object.entries(router.routeConfig)
            .map(([path, id]) => {
              return ([path, Shell[id as keyof Shell]]);
            })
            .map(([path, Component]) => (
              <Route {...{
                key: path as string,
                path: path as string,
                exact: true,
                render: (props: any) => <Component {...props} />,
              }} />
            ))}
        </Switch>
      </Router>
    </div>
  );
};

const dependencies = [Injected.Shell, Injected.router] as const;
Object.assign(AppView, {[Symbol.for('ram.deps')]: dependencies});
