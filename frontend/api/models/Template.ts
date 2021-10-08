/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentStatusEnum } from './DocumentStatusEnum';
import type { FillablePdfSettings } from './FillablePdfSettings';
import type { TemplateSettings } from './TemplateSettings';
import type { Type1ebEnum } from './Type1ebEnum';

/**
 * Adds support for write once fields to serializers.
 * Write value only in `post` and not allow the field to be updated in `put/patch` requests.
 *
 * To use it, specify a list of fields as `write_once_fields` on the serializer's Meta:
 * ```
 * class Meta:
 * model = SomeModel
 * fields = '__all__'
 * write_once_fields = ('collection', )
 * ```
 *
 * Now the fields in `write_once_fields` can be set during POST (create),
 * but cannot be changed afterwards via PUT or PATCH (update).
 * Inspired by https://stackoverflow.com/a/37487134/627411.
 * Taken from https://blog.qax.io/write-once-fields-with-django-rest-framework/
 */
export type Template = {
    readonly id: number;
    preferences?: TemplateSettings;
    readonly info: FillablePdfSettings;
    dynamic_images?: Array<{
        token: string,
        left: number,
        top: number,
        page: number,
        width?: number,
        height?: number,
    }> | null;
    title: string;
    description?: string | null;
    type: Type1ebEnum;
    readonly created_time: string;
    document_status?: DocumentStatusEnum;
    deleted_time?: string | null;
    folder?: number | null;
}
