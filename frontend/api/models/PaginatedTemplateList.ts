/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Template } from './Template';

export type PaginatedTemplateList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Template>;
}
