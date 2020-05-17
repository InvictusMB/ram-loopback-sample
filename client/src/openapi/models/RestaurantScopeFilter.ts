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
 * 
 * @export
 * @interface RestaurantScopeFilter
 */
export interface RestaurantScopeFilter {
    /**
     * 
     * @type {number}
     * @memberof RestaurantScopeFilter
     */
    offset?: number;
    /**
     * 
     * @type {number}
     * @memberof RestaurantScopeFilter
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof RestaurantScopeFilter
     */
    skip?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof RestaurantScopeFilter
     */
    order?: Array<string>;
    /**
     * 
     * @type {{ [key: string]: object; }}
     * @memberof RestaurantScopeFilter
     */
    where?: { [key: string]: object; };
    /**
     * 
     * @type {{ [key: string]: object; }}
     * @memberof RestaurantScopeFilter
     */
    fields?: { [key: string]: object; };
}

export function RestaurantScopeFilterFromJSON(json: any): RestaurantScopeFilter {
    return RestaurantScopeFilterFromJSONTyped(json, false);
}

export function RestaurantScopeFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): RestaurantScopeFilter {
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

export function RestaurantScopeFilterToJSON(value?: RestaurantScopeFilter | null): any {
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


