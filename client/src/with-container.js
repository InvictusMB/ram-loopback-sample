import hoistStatics from 'hoist-non-react-statics';
import {useObserver} from 'mobx-react';

import {asValue, asFunction} from './core';
import './ram-context';

const Injected = (global || window).Injected;

export function createInjector(container) {
  const shell = createShell(container);
  return component => withContainer(shell, component);
}

export function withContainer(container, component) {

  const componentName = (
    component.displayName
    || component.name
    || (component.constructor && component.constructor.name)
    || 'anonymous'
  );

  function Injector(props) {
    const deps = resolveDependencies(container, component);

    const newProps = {
      ...deps,
      ...props,
    };

    return useObserver(() => component(newProps));
  }

  Object.assign(Injector, {
    displayName: `${componentName}-with-container`,
    wrappedComponent: component,
  });

  // Static fields from component should be visible on the generated Injector
  hoistStatics(Injector, component);

  return Injector;
}

function createShell(container) {
  const shell = container.createScope();
  shell.register({
    // react-dev-tools shims
    $$typeof: asValue(undefined),
    size: asFunction(() => Object.keys(shell.registrations).length - 2),
  });
  return shell;
}

function resolveDependencies(diContainer, component) {
  const dependencies = component[Symbol.for('ram.deps')];
  const registrations = dependencies || resolveRegistrationsAndWarn(diContainer, component);
  return registrations.reduce((acc, name) => {
    if (name === Injected.Shell) {
      acc[name] = diContainer.cradle;
      return acc;
    }
    acc[name] = diContainer.resolve(name);
    return acc;
  }, {});
}

function resolveRegistrationsAndWarn(diContainer, component) {
  console.warn('Resolving entire container for', component, 'Reason: dependencies not detected');
  return Object.keys(diContainer.registrations).concat([Injected.Shell]);
}
