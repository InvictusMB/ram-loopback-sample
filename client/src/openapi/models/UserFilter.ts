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

import * as runtime from '../runtime';
import { exists, mapValues } from '../runtime';
import {
    UserFields,
    UserFieldsFromJSON,
    UserFieldsFromJSONTyped,
    UserFieldsToJSON,
    UserIncludeFilterItems,
    UserIncludeFilterItemsFromJSON,
    UserIncludeFilterItemsFromJSONTyped,
    UserIncludeFilterItemsToJSON,
} from './';

/**
 *
 * @export
 * @interface UserFilter
 */
export type UserFilter = {
    /**
     *
     * @type {number}
     * @memberof UserFilter
     */
    offset?: number;
    /**
     *
     * @type {number}
     * @memberof UserFilter
     */
    limit?: number;
    /**
     *
     * @type {number}
     * @memberof UserFilter
     */
    skip?: number;
    /**
     *
     * @type {Array<string>}
     * @memberof UserFilter
     */
    order?: Array<string>;
    /**
     *
     * @type {{ [key: string]: object; }}
     * @memberof UserFilter
     */
    where?: runtime.HTTPQuery;
    /**
     *
     * @type {UserFields}
     * @memberof UserFilter
     */
    fields?: UserFields;
    /**
     *
     * @type {Array<UserIncludeFilterItems>}
     * @memberof UserFilter
     */
    include?: UserIncludeFilterItems[];
}

export function UserFilterFromJSON(json: any): UserFilter {
    return UserFilterFromJSONTyped(json, false);
}

export function UserFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserFilter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'offset': !exists(json, 'offset') ? undefined : json['offset'],
        'limit': !exists(json, 'limit') ? undefined : json['limit'],
        'skip': !exists(json, 'skip') ? undefined : json['skip'],
        'order': !exists(json, 'order') ? undefined : json['order'],
        'where': !exists(json, 'where') ? undefined : json['where'],
        'fields': !exists(json, 'fields') ? undefined : UserFieldsFromJSON(json['fields']),
        'include': !exists(json, 'include') ? undefined : ((json['include'] as Array<any>).map(UserIncludeFilterItemsFromJSON)),
    };
}

export function UserFilterToJSON(value?: UserFilter | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'offset': value.offset,
        'limit': value.limit,
        'skip': value.skip,
        'order': value.order,
        'where': value.where,
        'fields': UserFieldsToJSON(value.fields),
        'include': value.include === undefined ? undefined : ((value.include as Array<any>).map(UserIncludeFilterItemsToJSON)),
    };
}


