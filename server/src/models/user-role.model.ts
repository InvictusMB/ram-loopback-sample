import {JsonSchemaWithExtensions} from '@loopback/repository';

const USER_ROLES = ['user', 'business', 'admin'] as const;

export type UserRole = typeof USER_ROLES[number];

export const roleSchema: JsonSchemaWithExtensions = {
  type: 'string',
  enum: USER_ROLES.slice(),
};
