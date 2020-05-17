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
 * (tsType: Omit<Review, 'id' | 'restaurantId'>, schemaOptions: { title: 'NewReviewInRestaurant', exclude: [ 'id', 'restaurantId' ] })
 * @export
 * @interface NewReviewInRestaurant
 */
export interface NewReviewInRestaurant {
    /**
     * 
     * @type {number}
     * @memberof NewReviewInRestaurant
     */
    rating: number;
    /**
     * 
     * @type {string}
     * @memberof NewReviewInRestaurant
     */
    comment: string;
    /**
     * 
     * @type {Date}
     * @memberof NewReviewInRestaurant
     */
    date: Date;
    /**
     * 
     * @type {string}
     * @memberof NewReviewInRestaurant
     */
    authorId?: string;
}

export function NewReviewInRestaurantFromJSON(json: any): NewReviewInRestaurant {
    return NewReviewInRestaurantFromJSONTyped(json, false);
}

export function NewReviewInRestaurantFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewReviewInRestaurant {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rating': json['rating'],
        'comment': json['comment'],
        'date': (new Date(json['date'])),
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
    };
}

export function NewReviewInRestaurantToJSON(value?: NewReviewInRestaurant | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rating': value.rating,
        'comment': value.comment,
        'date': (value.date.toISOString()),
        'authorId': value.authorId,
    };
}

