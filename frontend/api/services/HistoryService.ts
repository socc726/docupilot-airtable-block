/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedMergeHistoryList } from '../models/PaginatedMergeHistoryList';
import { request as __request } from '../core/request';

export class HistoryService {

    /**
     * Get created documents history
     * @param document
     * @param endDate DateTime in this format: 2019-05-02 16:25:12.353000
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param startDate DateTime in this format: 2019-05-02 16:25:12.353000
     * @param status
     * @returns PaginatedMergeHistoryList
     * @throws ApiError
     */
    public static async getCreatedDocumentsHistory(
        document?: number,
        endDate?: string,
        ordering?: string,
        page?: number,
        startDate?: string,
        status?: 'error' | 'pending' | 'success',
    ): Promise<PaginatedMergeHistoryList> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/history/`,
            query: {
                'document': document,
                'end_date': endDate,
                'ordering': ordering,
                'page': page,
                'start_date': startDate,
                'status': status,
            },
        });
        return result.body;
    }

    /**
     * download generated document if available
     * @param id A unique integer value identifying this merge history.
     * @returns any
     * @throws ApiError
     */
    public static async downloadCreatedDocument(
        id: number,
    ): Promise<any> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/history/${id}/download/`,
        });
        return result.body;
    }

}