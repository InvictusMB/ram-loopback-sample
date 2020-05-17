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
import {
    RestaurantWithRelations,
    RestaurantWithRelationsFromJSON,
    RestaurantWithRelationsFromJSONTyped,
    RestaurantWithRelationsToJSON,
    ReviewResponseWithRelations,
    ReviewResponseWithRelationsFromJSON,
    ReviewResponseWithRelationsFromJSONTyped,
    ReviewResponseWithRelationsToJSON,
    UserWithRelations,
    UserWithRelationsFromJSON,
    UserWithRelationsFromJSONTyped,
    UserWithRelationsToJSON,
} from './index';

/**
 * (tsType: ReviewWithRelations, schemaOptions: { includeRelations: true })
 * @export
 * @interface ReviewWithRelations
 */
export interface ReviewWithRelations {
    /**
     *
     * @type {string}
     * @memberof ReviewWithRelations
     */
    id?: string;
    /**
     *
     * @type {number}
     * @memberof ReviewWithRelations
     */
    rating: number;
    /**
     *
     * @type {string}
     * @memberof ReviewWithRelations
     */
    comment: string;
    /**
     *
     * @type {Date}
     * @memberof ReviewWithRelations
     */
    date: Date;
    /**
     *
     * @type {string}
     * @memberof ReviewWithRelations
     */
    restaurantId?: string;
    /**
     *
     * @type {string}
     * @memberof ReviewWithRelations
     */
    authorId?: string;
    /**
     *
     * @type {RestaurantWithRelations}
     * @memberof ReviewWithRelations
     */
    restaurant?: RestaurantWithRelations;
    /**
     *
     * @type {UserWithRelations}
     * @memberof ReviewWithRelations
     */
    author?: UserWithRelations;
    /**
     *
     * @type {Array<ReviewResponseWithRelations>}
     * @memberof ReviewWithRelations
     */
    reviewResponses?: Array<ReviewResponseWithRelations>;
}

export function ReviewWithRelationsFromJSON(json: any): ReviewWithRelations {
    return ReviewWithRelationsFromJSONTyped(json, false);
}

export function ReviewWithRelationsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReviewWithRelations {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'id': !exists(json, 'id') ? undefined : json['id'],
        'rating': json['rating'],
        'comment': json['comment'],
        'date': (new Date(json['date'])),
        'restaurantId': !exists(json, 'restaurantId') ? undefined : json['restaurantId'],
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
        'restaurant': !exists(json, 'restaurant') ? undefined : RestaurantWithRelationsFromJSON(json['restaurant']),
        'author': !exists(json, 'author') ? undefined : UserWithRelationsFromJSON(json['author']),
        'reviewResponses': !exists(json, 'reviewResponses') ? undefined : ((json['reviewResponses'] as Array<any>).map(ReviewResponseWithRelationsFromJSON)),
    };
}

export function ReviewWithRelationsToJSON(value?: ReviewWithRelations | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'id': value.id,
        'rating': value.rating,
        'comment': value.comment,
        'date': (value.date.toISOString()),
        'restaurantId': value.restaurantId,
        'authorId': value.authorId,
        'restaurant': RestaurantWithRelationsToJSON(value.restaurant),
        'author': UserWithRelationsToJSON(value.author),
        'reviewResponses': value.reviewResponses === undefined ? undefined : ((value.reviewResponses as Array<any>).map(ReviewResponseWithRelationsToJSON)),
    };
}

