import {registerModule} from '@ram-stack/composition-root/macro';
import React from 'react';
import {render} from 'react-dom';
import {asClass, asValue, createContainer, observer} from './core';
import {createInjector} from './with-container';
import * as serviceWorker from './serviceWorker';

import './styles/tailwind.css';

const container = createContainer();

const withContainer = createInjector(container);

registerModule({
  asClass,
  asValue,
  container,
  observer,
  withContainer,
}, '.');

const AppView = container.resolve('AppView') as any;

render(<AppView />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
