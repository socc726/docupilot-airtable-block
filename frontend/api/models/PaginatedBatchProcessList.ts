/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatchProcess } from './BatchProcess';

export type PaginatedBatchProcessList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<BatchProcess>;
}
