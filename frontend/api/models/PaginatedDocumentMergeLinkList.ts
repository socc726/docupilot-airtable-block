/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentMergeLink } from './DocumentMergeLink';

export type PaginatedDocumentMergeLinkList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<DocumentMergeLink>;
}
