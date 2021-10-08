/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExtendedReadOnlyFields } from '../models/ExtendedReadOnlyFields';
import type { PaginatedTemplateList } from '../models/PaginatedTemplateList';
import type { Template } from '../models/Template';
import { request as __request } from '../core/request';

export class TemplatesService {

    /**
     * Get list of templates
     * @param folder
     * @param ordering Which field to use when ordering the results.
     * @param outputType
     * @param page A page number within the paginated result set.
     * @param search A search term.
     * @param status
     * @param type
     * @returns PaginatedTemplateList
     * @throws ApiError
     */
    public static async listTemplates(
        folder?: number,
        ordering?: string,
        outputType?: 'docx' | 'jpeg' | 'pdf' | 'png',
        page?: number,
        search?: string,
        status?: 'active' | 'test',
        type?: 'docx' | 'fillable_pdf' | 'g_document' | 'g_presentation' | 'g_spreadsheet' | 'html' | 'pptx' | 'xlsx',
    ): Promise<PaginatedTemplateList> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/`,
            query: {
                'folder': folder,
                'ordering': ordering,
                'output_type': outputType,
                'page': page,
                'search': search,
                'status': status,
                'type': type,
            },
        });
        return result.body;
    }

    /**
     * Create template
     * @param requestBody
     * @returns Template
     * @throws ApiError
     */
    public static async createTemplate(
        requestBody: Template,
    ): Promise<Template> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get one template
     * @param id A unique integer value identifying this document.
     * @returns Template
     * @throws ApiError
     */
    public static async getTemplate(
        id: number,
    ): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${id}/`,
        });
        return result.body;
    }

    /**
     * Update template
     * @param id A unique integer value identifying this document.
     * @param requestBody
     * @returns Template
     * @throws ApiError
     */
    public static async updateTemplate(
        id: number,
        requestBody: ExtendedReadOnlyFields,
    ): Promise<Template> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/templates/${id}/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Move template to trash
     * @param id A unique integer value identifying this document.
     * @returns void
     * @throws ApiError
     */
    public static async trashTemplate(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/v2/templates/${id}/`,
        });
        return result.body;
    }

    /**
     * Get template content
     * @param id A unique integer value identifying this document.
     * @returns Template
     * @throws ApiError
     */
    public static async getContent(
        id: number,
    ): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${id}/content/`,
        });
        return result.body;
    }

    /**
     * Update template content
     * @param id A unique integer value identifying this document.
     * @param requestBody
     * @returns Template
     * @throws ApiError
     */
    public static async updateContent(
        id: number,
        requestBody: Template,
    ): Promise<Template> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/templates/${id}/content/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a template permanently from trash
     * @param id A unique integer value identifying this document.
     * @returns void
     * @throws ApiError
     */
    public static async deleteTemplatePermanently(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/v2/templates/${id}/permanent_delete/`,
        });
        return result.body;
    }

    /**
     * Restore a template from trash
     * @param id A unique integer value identifying this document.
     * @param requestBody
     * @returns Template
     * @throws ApiError
     */
    public static async restoreTemplateFromTrash(
        id: number,
        requestBody: Template,
    ): Promise<Template> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/templates/${id}/restore/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get template schema
     * @param id A unique integer value identifying this document.
     * @returns Template
     * @throws ApiError
     */
    public static async getTemplateSchema(
        id: number,
    ): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/${id}/schema/`,
        });
        return result.body;
    }

    /**
     * List all templates
     * Will return all templates without pagination, excluding templates in trashed
     * @returns Template
     * @throws ApiError
     */
    public static async listAllTemplates(): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/all/`,
        });
        return result.body;
    }

    /**
     * Download template file
     * @param templateId
     * @returns Template
     * @throws ApiError
     */
    public static async downloadTemplateFile(
        templateId: number,
    ): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/download/`,
        });
        return result.body;
    }

    /**
     * List all templates in trash.
     * @returns Template
     * @throws ApiError
     */
    public static async listTrashedTemplates(): Promise<Template> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/templates/trash/`,
        });
        return result.body;
    }

}