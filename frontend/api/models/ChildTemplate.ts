/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentStatusEnum } from './DocumentStatusEnum';
import type { Type1ebEnum } from './Type1ebEnum';

export type ChildTemplate = {
    description?: string | null;
    type?: Type1ebEnum;
    readonly created_time: string;
    document_status?: DocumentStatusEnum;
    deleted_time?: string | null;
    org: number;
    created_by: number;
    folder?: number | null;
}
