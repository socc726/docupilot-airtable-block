/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FormatEnum } from './FormatEnum';
import type { OrientationEnum } from './OrientationEnum';
import type { OutputTypeEnum } from './OutputTypeEnum';

export type TemplateSettings = {
    output_file_name?: string;
    output_type?: OutputTypeEnum;
    flatten_pdf?: boolean;
    format?: FormatEnum;
    orientation?: OrientationEnum;
    timezone?: string;
    auto_number?: number | null;
    header?: string | null;
    footer?: string | null;
    margin?: {
        top?: number,
        left?: number,
        right?: number,
        bottom?: number,
    } | null;
}
