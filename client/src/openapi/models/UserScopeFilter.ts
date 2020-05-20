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
/**
 *
 * @export
 * @interface UserScopeFilter
 */
export type UserScopeFilter = {
    /**
     *
     * @type {number}
     * @memberof UserScopeFilter
     */
    offset?: number;
    /**
     *
     * @type {number}
     * @memberof UserScopeFilter
     */
    limit?: number;
    /**
     *
     * @type {number}
     * @memberof UserScopeFilter
     */
    skip?: number;
    /**
     *
     * @type {Array<string>}
     * @memberof UserScopeFilter
     */
    order?: Array<string>;
    /**
     *
     * @type {{ [key: string]: object; }}
     * @memberof UserScopeFilter
     */
    where?: runtime.HTTPQuery;
    /**
     *
     * @type {{ [key: string]: object; }}
     * @memberof UserScopeFilter
     */
    fields?: runtime.HTTPQuery;
}

export function UserScopeFilterFromJSON(json: any): UserScopeFilter {
    return UserScopeFilterFromJSONTyped(json, false);
}

export function UserScopeFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserScopeFilter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'offset': !exists(json, 'offset') ? undefined : json['offset'],
        'limit': !exists(json, 'limit') ? undefined : json['limit'],
        'skip': !exists(json, 'skip') ? undefined : json['skip'],
        'order': !exists(json, 'order') ? undefined : json['order'],
        'where': !exists(json, 'where') ? undefined : json['where'],
        'fields': !exists(json, 'fields') ? undefined : json['fields'],
    };
}

export function UserScopeFilterToJSON(value?: UserScopeFilter | null): any {
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
        'fields': value.fields,
    };
}


