import {
  parse,
  stringify,
} from 'qs';

export * from './is-allowed';
export * from './validation-parser';

export const qs = {
  stringify,
  parse,
};
