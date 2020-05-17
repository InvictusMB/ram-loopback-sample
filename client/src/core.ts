import {createContainer as createAwilixContainer, InjectionMode} from 'awilix';

export {asClass, asValue, asFunction} from 'awilix';
export * from 'mobx';
export * from 'mobx-react';
export {task} from 'mobx-task';

export function createContainer() {
  return createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });
}
