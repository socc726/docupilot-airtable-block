/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Folder } from '../models/Folder';
import { request as __request } from '../core/request';

export class FoldersService {

    /**
     * Get list of folders
     * @param ordering Which field to use when ordering the results.
     * @returns Folder
     * @throws ApiError
     */
    public static async listFolders(
        ordering?: string,
    ): Promise<Array<Folder>> {
        const result = await __request({
            method: 'GET',
            path: `/api/v2/folders/`,
            query: {
                'ordering': ordering,
            },
        });
        return result.body;
    }

    /**
     * Create a folder
     * @param requestBody
     * @returns Folder
     * @throws ApiError
     */
    public static async createFolder(
        requestBody: Folder,
    ): Promise<Folder> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/folders/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a folder
     * @param id A unique integer value identifying this folder.
     * @param requestBody
     * @returns Folder
     * @throws ApiError
     */
    public static async updateFolder(
        id: number,
        requestBody: Folder,
    ): Promise<Folder> {
        const result = await __request({
            method: 'PUT',
            path: `/api/v2/folders/${id}/`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a folder.
     * This operation moves all templates under this folder to home directory.
     * @param id A unique integer value identifying this folder.
     * @returns void
     * @throws ApiError
     */
    public static async deleteFolder(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/v2/folders/${id}/`,
        });
        return result.body;
    }

}