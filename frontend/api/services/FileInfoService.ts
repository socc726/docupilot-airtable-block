/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileInfo } from '../models/FileInfo';
import { request as __request } from '../core/request';

export class FileInfoService {

    /**
     * @param requestBody
     * @returns FileInfo
     * @throws ApiError
     */
    public static async uploadTemplate(
        requestBody?: any,
    ): Promise<FileInfo> {
        const result = await __request({
            method: 'POST',
            path: `/api/v2/file_info/upload_template/`,
            body: requestBody,
        });
        return result.body;
    }

}