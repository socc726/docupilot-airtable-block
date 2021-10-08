/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerNotification } from '../models/BannerNotification';
import type { Meta } from '../models/Meta';
import type { Plan } from '../models/Plan';
import type { Timezone } from '../models/Timezone';
import { request as __request } from '../core/request';

export class GeneralService {

    /**
     * @returns BannerNotification
     * @throws ApiError
     */
    public static async listBannerNotifications(): Promise<BannerNotification> {
        const result = await __request({
            method: 'GET',
            path: `/banner_notifications/`,
        });
        return result.body;
    }

    /**
     * @returns Meta
     * @throws ApiError
     */
    public static async getAppMeta(): Promise<Meta> {
        const result = await __request({
            method: 'GET',
            path: `/meta/`,
        });
        return result.body;
    }

    /**
     * @returns Plan
     * @throws ApiError
     */
    public static async listSubscriptionPlans(): Promise<Plan> {
        const result = await __request({
            method: 'GET',
            path: `/plans/`,
        });
        return result.body;
    }

    /**
     * @returns Timezone
     * @throws ApiError
     */
    public static async listTimezones(): Promise<Timezone> {
        const result = await __request({
            method: 'GET',
            path: `/tz/`,
        });
        return result.body;
    }

}