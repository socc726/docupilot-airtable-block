/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchProcess } from '../models/BatchProcess';
import type { PaginatedBatchProcessList } from '../models/PaginatedBatchProcessList';
import { request as __request } from '../core/request';

export class GenerateBulkService {

    /**
     * List bulk generation tasks
     * @param templateId
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @returns PaginatedBatchProcessList
     * @throws ApiError
     */
    public static async listBulkGenerationTasks(
        templateId: number,
        ordering?: string,
        page?: number,
    ): Promise<PaginatedBatchProcessList> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/bulk_generate/`,
            query: {
                'ordering': ordering,
                'page': page,
            },
        });
        return result.body;
    }

    /**
     * Get bulk generation task
     * @param id Task id
     * @param templateId Template id
     * @returns BatchProcess
     * @throws ApiError
     */
    public static async getBulkGenerationTask(
        id: number,
        templateId: number,
    ): Promise<BatchProcess> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/bulk_generate/${id}/`,
        });
        return result.body;
    }

    /**
     * Cancel a bulk generation task
     * @param id Task id
     * @param templateId Template id
     * @param requestBody
     * @returns BatchProcess
     * @throws ApiError
     */
    public static async cancelBulkGenerationTask(
        id: number,
        templateId: number,
        requestBody: BatchProcess,
    ): Promise<BatchProcess> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/templates/${templateId}/bulk_generate/${id}/cancel/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get a task saved as draft
     * @param id Task id
     * @param templateId Template id
     * @returns BatchProcess
     * @throws ApiError
     */
    public static async getBulkGenerationDraft(
        id: number,
        templateId: number,
    ): Promise<BatchProcess> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/bulk_generate/${id}/draft/`,
        });
        return result.body;
    }

    /**
     * Trigger a bulk generation task
     * @param id Task id
     * @param templateId Template id
     * @param requestBody
     * @returns BatchProcess
     * @throws ApiError
     */
    public static async triggerBulkGenerationDraft(
        id: number,
        templateId: number,
        requestBody: BatchProcess,
    ): Promise<BatchProcess> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/${templateId}/bulk_generate/${id}/trigger/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Upload a new csv for bulk generate.
     * This will create a task in DRAFT mode.
     * @param templateId Template id
     * @param requestBody
     * @returns BatchProcess
     * @throws ApiError
     */
    public static async uploadForBulkGeneration(
        templateId: number,
        requestBody: BatchProcess,
    ): Promise<BatchProcess> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/${templateId}/bulk_generate/upload/`,
            body: requestBody,
        });
        return result.body;
    }

}