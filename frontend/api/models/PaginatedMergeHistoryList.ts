/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MergeHistory } from './MergeHistory';

export type PaginatedMergeHistoryList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<MergeHistory>;
}
