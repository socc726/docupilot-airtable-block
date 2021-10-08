/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BulkGenerateMeta } from './BulkGenerateMeta';
import type { FileUploadMeta } from './FileUploadMeta';
import type { SubscriptionMeta } from './SubscriptionMeta';

export type Meta = {
    file_uploads: FileUploadMeta;
    subscription: SubscriptionMeta;
    batch_process_max_allowed_test_rows: BulkGenerateMeta;
}
