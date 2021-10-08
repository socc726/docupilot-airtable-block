/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Delivery } from '../models/Delivery';
import type { PaginatedDeliveryList } from '../models/PaginatedDeliveryList';
import { request as __request } from '../core/request';

export class TemplateDeliveryService {

    /**
     * Get deliveries configured under this template
     * @param templateId
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @returns PaginatedDeliveryList
     * @throws ApiError
     */
    public static async listTemplateDeliveries(
        templateId: number,
        ordering?: string,
        page?: number,
    ): Promise<PaginatedDeliveryList> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/deliveries/`,
            query: {
                'ordering': ordering,
                'page': page,
            },
        });
        return result.body;
    }

    /**
     * Create delivery
     * @param templateId
     * @param requestBody
     * @returns Delivery
     * @throws ApiError
     */
    public static async createTemplateDelivery(
        templateId: number,
        requestBody: Delivery,
    ): Promise<Delivery> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/${templateId}/deliveries/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get delivery
     * @param id A unique integer value identifying this delivery.
     * @param templateId
     * @returns Delivery
     * @throws ApiError
     */
    public static async retrieveTemplateDelivery(
        id: number,
        templateId: number,
    ): Promise<Delivery> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/deliveries/${id}/`,
        });
        return result.body;
    }

    /**
     * Update delivery
     * @param id A unique integer value identifying this delivery.
     * @param templateId
     * @param requestBody
     * @returns Delivery
     * @throws ApiError
     */
    public static async updateTemplateDelivery(
        id: number,
        templateId: number,
        requestBody: Delivery,
    ): Promise<Delivery> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/templates/${templateId}/deliveries/${id}/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete delivery
     * @param id A unique integer value identifying this delivery.
     * @param templateId
     * @returns void
     * @throws ApiError
     */
    public static async deleteTemplateDelivery(
        id: number,
        templateId: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/v2/templates/${templateId}/deliveries/${id}/`,
        });
        return result.body;
    }

}