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
 * (tsType: Omit<ReviewResponse, 'id' | 'reviewId'>, schemaOptions: { title: 'NewReviewResponseInReview', exclude: [ 'id', 'reviewId' ] })
 * @export
 * @interface NewReviewResponseInReview
 */
export interface NewReviewResponseInReview {
    /**
     * 
     * @type {string}
     * @memberof NewReviewResponseInReview
     */
    comment: string;
}

export function NewReviewResponseInReviewFromJSON(json: any): NewReviewResponseInReview {
    return NewReviewResponseInReviewFromJSONTyped(json, false);
}

export function NewReviewResponseInReviewFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewReviewResponseInReview {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'comment': json['comment'],
    };
}

export function NewReviewResponseInReviewToJSON(value?: NewReviewResponseInReview | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'comment': value.comment,
    };
}


