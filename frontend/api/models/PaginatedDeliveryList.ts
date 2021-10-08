/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Delivery } from './Delivery';

export type PaginatedDeliveryList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Delivery>;
}
