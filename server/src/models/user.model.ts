// Based on loopback4-example-shopping

import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';
import {roleSchema, UserRole} from './user-role.model';

@model({
  settings: {
    indexes: {
      uniqueName: {
        keys: {
          name: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @property.array('string', {
    jsonSchema: roleSchema
  })
  roles: UserRole[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
