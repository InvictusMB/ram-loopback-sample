import {registerModule} from '@ram-stack/composition-root/macro';
import React from 'react';
import {render} from 'react-dom';
import {asClass, asValue, createContainer, observer} from './core';
import * as serviceWorker from './serviceWorker';
import {createRouter} from './router';

import './styles/tailwind.css';
import {createInjector} from './with-container';

const container = createContainer();
const router = createRouter();

const withContainer = createInjector(container);

registerModule({
  asClass,
  asValue,
  container,
  router,
  observer,
  withContainer,
}, '.');

container.register({router: asValue(router)})

const AppView = container.resolve('AppView') as any;

render(<AppView />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
