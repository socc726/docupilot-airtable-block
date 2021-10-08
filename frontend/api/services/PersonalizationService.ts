/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserPersonalization } from '../models/UserPersonalization';
import { request as __request } from '../core/request';

export class PersonalizationService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static async getUserPersonalization(): Promise<Record<string, any>> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/personalization/`,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns UserPersonalization
     * @throws ApiError
     */
    public static async updateUserPersonalization(
        requestBody: UserPersonalization,
    ): Promise<UserPersonalization> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/personalization/`,
            body: requestBody,
        });
        return result.body;
    }

}