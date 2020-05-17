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
import {
    LoopbackCount,
    LoopbackCountFromJSON,
    LoopbackCountToJSON,
    NewRestaurant,
    NewRestaurantFromJSON,
    NewRestaurantToJSON,
    Restaurant,
    RestaurantFromJSON,
    RestaurantToJSON,
    RestaurantFilter,
    RestaurantFilterFromJSON,
    RestaurantFilterToJSON,
    RestaurantFilter1,
    RestaurantFilter1FromJSON,
    RestaurantFilter1ToJSON,
    RestaurantPartial,
    RestaurantPartialFromJSON,
    RestaurantPartialToJSON,
    RestaurantWithRelations,
    RestaurantWithRelationsFromJSON,
    RestaurantWithRelationsToJSON,
} from '../models';

export interface RestaurantControllerCountRequest {
    where?: { [key: string]: object; };
}

export interface RestaurantControllerCreateRequest {
    newRestaurant?: NewRestaurant;
}

export interface RestaurantControllerDeleteByIdRequest {
    id: string;
}

export interface RestaurantControllerFindRequest {
    filter?: RestaurantFilter1;
}

export interface RestaurantControllerFindByIdRequest {
    id: string;
    filter?: RestaurantFilter;
}

export interface RestaurantControllerReplaceByIdRequest {
    id: string;
    restaurant?: Restaurant;
}

export interface RestaurantControllerUpdateByIdRequest {
    id: string;
    restaurantPartial?: RestaurantPartial;
}

/**
 * 
 */
export class RestaurantControllerApi extends runtime.BaseAPI {

    /**
     */
    async restaurantControllerCountRaw(requestParameters: RestaurantControllerCountRequest): Promise<runtime.ApiResponse<LoopbackCount>> {
        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.where !== undefined) {
            queryParameters['where'] = requestParameters.where;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/restaurants/count`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => LoopbackCountFromJSON(jsonValue));
    }

    /**
     */
    async restaurantControllerCount(requestParameters: RestaurantControllerCountRequest): Promise<LoopbackCount> {
        const response = await this.restaurantControllerCountRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async restaurantControllerCreateRaw(requestParameters: RestaurantControllerCreateRequest): Promise<runtime.ApiResponse<Restaurant>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("jwt", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/restaurants`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewRestaurantToJSON(requestParameters.newRestaurant),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RestaurantFromJSON(jsonValue));
    }

    /**
     */
    async restaurantControllerCreate(requestParameters: RestaurantControllerCreateRequest): Promise<Restaurant> {
        const response = await this.restaurantControllerCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async restaurantControllerDeleteByIdRaw(requestParameters: RestaurantControllerDeleteByIdRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling restaurantControllerDeleteById.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("jwt", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/restaurants/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async restaurantControllerDeleteById(requestParameters: RestaurantControllerDeleteByIdRequest): Promise<void> {
        await this.restaurantControllerDeleteByIdRaw(requestParameters);
    }

    /**
     */
    async restaurantControllerFindRaw(requestParameters: RestaurantControllerFindRequest): Promise<runtime.ApiResponse<Array<RestaurantWithRelations>>> {
        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.filter !== undefined) {
            queryParameters['filter'] = requestParameters.filter;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/restaurants`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RestaurantWithRelationsFromJSON));
    }

    /**
     */
    async restaurantControllerFind(requestParameters: RestaurantControllerFindRequest): Promise<Array<RestaurantWithRelations>> {
        const response = await this.restaurantControllerFindRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async restaurantControllerFindByIdRaw(requestParameters: RestaurantControllerFindByIdRequest): Promise<runtime.ApiResponse<RestaurantWithRelations>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling restaurantControllerFindById.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.filter !== undefined) {
            queryParameters['filter'] = requestParameters.filter;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/restaurants/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => RestaurantWithRelationsFromJSON(jsonValue));
    }

    /**
     */
    async restaurantControllerFindById(requestParameters: RestaurantControllerFindByIdRequest): Promise<RestaurantWithRelations> {
        const response = await this.restaurantControllerFindByIdRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async restaurantControllerReplaceByIdRaw(requestParameters: RestaurantControllerReplaceByIdRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling restaurantControllerReplaceById.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("jwt", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/restaurants/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RestaurantToJSON(requestParameters.restaurant),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async restaurantControllerReplaceById(requestParameters: RestaurantControllerReplaceByIdRequest): Promise<void> {
        await this.restaurantControllerReplaceByIdRaw(requestParameters);
    }

    /**
     */
    async restaurantControllerUpdateByIdRaw(requestParameters: RestaurantControllerUpdateByIdRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling restaurantControllerUpdateById.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("jwt", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/restaurants/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: RestaurantPartialToJSON(requestParameters.restaurantPartial),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async restaurantControllerUpdateById(requestParameters: RestaurantControllerUpdateByIdRequest): Promise<void> {
        await this.restaurantControllerUpdateByIdRaw(requestParameters);
    }

}
