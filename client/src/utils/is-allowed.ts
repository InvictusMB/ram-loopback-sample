import _ from 'lodash';
import {User as UserProfile, UserRolesEnum} from '../openapi/models';

export function isAllowed(allowedRoles: UserRolesEnum[], user: UserProfile) {
  return !!_.intersection(allowedRoles, user.roles ?? []).length;
}
