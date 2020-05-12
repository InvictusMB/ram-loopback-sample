// Based on loopback4-example-shopping

import {model, property, Model} from '@loopback/repository';

@model()
export class LoginCredentials extends Model {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z][\\d\\w\\.\\@]+$',
      errorMessage: {
        pattern: 'may contain only alphanumeric characters and ".", "_" or "@"'
      }
    },
  })
  login: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;

  constructor(data?: Partial<LoginCredentials>) {
    super(data);
  }
}
