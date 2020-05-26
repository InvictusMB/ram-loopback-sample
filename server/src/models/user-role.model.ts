import {JsonSchemaWithExtensions} from '@loopback/repository';

export enum USER_ROLE {
  USER = 'user',
  BUSINESS = 'business',
  ADMIN = 'admin'
}

export const roleSchema: JsonSchemaWithExtensions = {
  type: 'string',
  enum: Object.values(USER_ROLE),
};
