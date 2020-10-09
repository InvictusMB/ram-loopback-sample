import {registerModule} from '@ram-stack/composition-root/macro';
import type {InjectedDependencies} from "@ram-stack/context";
import {createCompositionRoot, createRouterRoot, di, view} from '@ram-stack/core';

import * as serviceWorker from './serviceWorker';
import './styles/tailwind.css';
import './ram-context';

const {asClass, asValue} = di;
const root = createCompositionRoot<InjectedDependencies>({
  onReady: renderApp,
});
const withInjected = root.withInjected;

const router = createRouterRoot();
root.container.register({
  routerRoot: asValue(router),
});

registerModule({
  asClass,
  asValue,
  root,
  withInjected,
  router,
}, '.');

function renderApp() {
  const Shell = root.container.resolve('Shell');

  view.renderDom(<Shell.AppView />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
