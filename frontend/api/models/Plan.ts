/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillingPeriodUnitEnum } from './BillingPeriodUnitEnum';

export type Plan = {
    plan_id: string;
    documents_allowed: number;
    price: number;
    billing_period_unit: BillingPeriodUnitEnum;
}
