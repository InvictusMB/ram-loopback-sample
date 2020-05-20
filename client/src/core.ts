import {createContainer as createAwilixContainer, InjectionMode} from 'awilix';
import {stringify, parse} from 'qs';

export {asClass, asValue, asFunction} from 'awilix';
export * from 'mobx';
export * from 'mobx-react';
export {task} from 'mobx-task';
export const qs = {
  stringify,
  parse,
};

export function createContainer() {
  return createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });
}

export {
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
  useHistory,
} from 'react-router-dom';
