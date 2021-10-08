/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatchProcessStatusEnum } from './BatchProcessStatusEnum';
import type { BatchProcessTask } from './BatchProcessTask';
import type { FileInfo } from './FileInfo';

export type BatchProcess = {
    readonly id: number;
    file: FileInfo;
    readonly errors: Array<BatchProcessTask>;
    status?: BatchProcessStatusEnum;
    start_time?: string | null;
    end_time?: string | null;
    total?: number | null;
    success?: number | null;
}
