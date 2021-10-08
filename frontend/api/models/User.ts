/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NullEnum } from './NullEnum';
import type { Organization } from './Organization';
import type { TimezoneEnum } from './TimezoneEnum';

export type User = {
    readonly id: number;
    first_name?: string;
    last_name?: string;
    readonly email: string;
    timezone?: (TimezoneEnum | NullEnum) | null;
    organization?: Organization;
}
