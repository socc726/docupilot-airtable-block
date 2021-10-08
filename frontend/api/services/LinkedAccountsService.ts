/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeliveryAccount } from '../models/DeliveryAccount';
import type { ExtendedReadOnlyFields } from '../models/ExtendedReadOnlyFields';
import { request as __request } from '../core/request';

export class LinkedAccountsService {

    /**
     * Get list of linked accounts
     * @param ordering Which field to use when ordering the results.
     * @param search A search term.
     * @param type
     * @returns DeliveryAccount
     * @throws ApiError
     */
    public static async listDeliveryAccounts(
        ordering?: string,
        search?: string,
        type?: 'aws_s3' | 'docu_sign' | 'dropbox' | 'eversign' | 'google_drive' | 'hellosign' | 'one_drive' | 'podio' | 'sign_now' | 'zoho_crm',
    ): Promise<Array<DeliveryAccount>> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/linked_accounts/`,
            query: {
                'ordering': ordering,
                'search': search,
                'type': type,
            },
        });
        return result.body;
    }

    /**
     * Create linked account
     * @param requestBody
     * @returns DeliveryAccount
     * @throws ApiError
     */
    public static async addDeliveryAccount(
        requestBody: DeliveryAccount,
    ): Promise<DeliveryAccount> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/linked_accounts/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Refresh linked account
     * @param id A unique integer value identifying this delivery account.
     * @param requestBody
     * @returns DeliveryAccount
     * @throws ApiError
     */
    public static async updateDeliveryAccount(
        id: number,
        requestBody: ExtendedReadOnlyFields,
    ): Promise<DeliveryAccount> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/linked_accounts/${id}/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Revoke linked account
     * @param id A unique integer value identifying this delivery account.
     * @returns void
     * @throws ApiError
     */
    public static async revokeDeliveryAccount(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/v2/linked_accounts/${id}/`,
        });
        return result.body;
    }

}