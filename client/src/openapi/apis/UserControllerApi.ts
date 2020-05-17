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
    InlineResponse200,
    InlineResponse200FromJSON,
    InlineResponse200ToJSON,
    LoginCredentials,
    LoginCredentialsFromJSON,
    LoginCredentialsToJSON,
    NewUser,
    NewUserFromJSON,
    NewUserToJSON,
    User,
    UserFromJSON,
    UserToJSON,
} from '../models';

export interface UserControllerCreateRequest {
    newUser?: NewUser;
}

export interface UserControllerDeleteByIdRequest {
    id: string;
}

export interface UserControllerFindByIdRequest {
    userId: string;
}

export interface UserControllerLoginRequest {
    loginCredentials?: LoginCredentials;
}

export interface UserControllerSetRequest {
    userId: string;
    user?: User;
}

/**
 * 
 */
export class UserControllerApi extends runtime.BaseAPI {

    /**
     */
    async userControllerCreateRaw(requestParameters: UserControllerCreateRequest): Promise<runtime.ApiResponse<User>> {
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
            path: `/users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewUserToJSON(requestParameters.newUser),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerCreate(requestParameters: UserControllerCreateRequest): Promise<User> {
        const response = await this.userControllerCreateRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async userControllerDeleteByIdRaw(requestParameters: UserControllerDeleteByIdRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling userControllerDeleteById.');
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
            path: `/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async userControllerDeleteById(requestParameters: UserControllerDeleteByIdRequest): Promise<void> {
        await this.userControllerDeleteByIdRaw(requestParameters);
    }

    /**
     */
    async userControllerFindByIdRaw(requestParameters: UserControllerFindByIdRequest): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling userControllerFindById.');
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
            path: `/users/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerFindById(requestParameters: UserControllerFindByIdRequest): Promise<User> {
        const response = await this.userControllerFindByIdRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async userControllerLoginRaw(requestParameters: UserControllerLoginRequest): Promise<runtime.ApiResponse<InlineResponse200>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/users/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginCredentialsToJSON(requestParameters.loginCredentials),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => InlineResponse200FromJSON(jsonValue));
    }

    /**
     */
    async userControllerLogin(requestParameters: UserControllerLoginRequest): Promise<InlineResponse200> {
        const response = await this.userControllerLoginRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async userControllerPrintCurrentUserRaw(): Promise<runtime.ApiResponse<User>> {
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
            path: `/users/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerPrintCurrentUser(): Promise<User> {
        const response = await this.userControllerPrintCurrentUserRaw();
        return await response.value();
    }

    /**
     */
    async userControllerSetRaw(requestParameters: UserControllerSetRequest): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling userControllerSet.');
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
            path: `/users/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UserToJSON(requestParameters.user),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerSet(requestParameters: UserControllerSetRequest): Promise<User> {
        const response = await this.userControllerSetRaw(requestParameters);
        return await response.value();
    }

}
