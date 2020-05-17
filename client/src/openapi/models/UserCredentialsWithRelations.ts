/* tslint:disable */
/* eslint-disable */
/**
 * server
 * server
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * (tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })
 * @export
 * @interface UserCredentialsWithRelations
 */
export interface UserCredentialsWithRelations {
    /**
     * 
     * @type {string}
     * @memberof UserCredentialsWithRelations
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof UserCredentialsWithRelations
     */
    password: string;
    /**
     * 
     * @type {number}
     * @memberof UserCredentialsWithRelations
     */
    userId: number;
}

export function UserCredentialsWithRelationsFromJSON(json: any): UserCredentialsWithRelations {
    return UserCredentialsWithRelationsFromJSONTyped(json, false);
}

export function UserCredentialsWithRelationsFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserCredentialsWithRelations {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'password': json['password'],
        'userId': json['userId'],
    };
}

export function UserCredentialsWithRelationsToJSON(value?: UserCredentialsWithRelations | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'password': value.password,
        'userId': value.userId,
    };
}


