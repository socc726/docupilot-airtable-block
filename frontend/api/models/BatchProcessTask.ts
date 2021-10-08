/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatchProcessTaskStatusEnum } from './BatchProcessTaskStatusEnum';
import type { MergeTypeEnum } from './MergeTypeEnum';

export type BatchProcessTask = {
    readonly id: number;
    merge_type?: MergeTypeEnum;
    merge_data?: Record<string, any> | null;
    status?: BatchProcessTaskStatusEnum;
    status_message?: string | null;
    batch_process: number;
    document: number;
}
