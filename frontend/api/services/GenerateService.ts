/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedDocumentMergeLinkList } from '../models/PaginatedDocumentMergeLinkList';
import type { Template } from '../models/Template';
import { request as __request } from '../core/request';

export class GenerateService {

    /**
     * Generate document from template
     * @param id A unique integer value identifying this document.
     * @param requestBody
     * @param download
     * @param testMode
     * @returns Template
     * @throws ApiError
     */
    public static async generateDocument(
        id: number,
        requestBody: Template,
        download?: 'false' | 'file' | 'true',
        testMode?: boolean,
    ): Promise<Template> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/${id}/generate/`,
            query: {
                'download': download,
                'test_mode': testMode,
            },
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get test data used for testing template
     * @param id A unique integer value identifying this document.
     * @returns Template
     * @throws ApiError
     */
    public static async getTestData(
        id: number,
    ): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${id}/test_data/`,
        });
        return result.body;
    }

    /**
     * Get document create link parameters
     * URL to create document will be /documents/create/{path}
     * @param templateId
     * @param page A page number within the paginated result set.
     * @returns PaginatedDocumentMergeLinkList
     * @throws ApiError
     */
    public static async listGenerationLinks(
        templateId: number,
        page?: number,
    ): Promise<PaginatedDocumentMergeLinkList> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${templateId}/merge_links/`,
            query: {
                'page': page,
            },
        });
        return result.body;
    }

}