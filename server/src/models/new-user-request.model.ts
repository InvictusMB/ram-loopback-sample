// Based on loopback4-example-shopping

import {model, property} from '@loopback/repository';
import {LoginCredentials} from './login-credentials.model';
import {roleSchema, USER_ROLE} from './user-role.model';
import {User} from './user.model';

@model()
export class NewUserRequest extends LoginCredentials {
  @property.array('string', {
    jsonSchema: roleSchema,
  })
  roles?: USER_ROLE[];

  constructor(data?: Partial<NewUserRequest>) {
    super(data);
  }
}

export function toUser(newUserRequest: NewUserRequest) {
  return new User({
    name: newUserRequest.login,
    roles: newUserRequest.roles ?? [USER_ROLE.USER],
  });
}
