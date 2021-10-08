/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ChildTemplate } from './ChildTemplate';
import type { MergeHistoryStatusEnum } from './MergeHistoryStatusEnum';

export type MergeHistory = {
    readonly id: number;
    readonly template: ChildTemplate;
    data: Record<string, any>;
    data_expired: boolean;
    document_expired: boolean;
    delivery_type: string;
    status: MergeHistoryStatusEnum;
    readonly created_time: string;
    created_file_name: string;
    message?: Record<string, any> | null;
    mode?: string | null;
}
