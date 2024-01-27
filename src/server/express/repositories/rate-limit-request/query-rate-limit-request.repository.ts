import { RateLimitRequestModel } from '../../models/rate-limit-request.model';

export class QueryRateLimitRequestRepository {
    static async countReqByIpAndUrl(ip: string, url: string): Promise<number> {
        try {
            const tenSecondsAgo = new Date(Date.now() - 10000);
            const count: number = await RateLimitRequestModel.countDocuments({
                ip,
                url,
                date: { $gte: tenSecondsAgo }, // Фильтр для подсчета записей не старше 10 секунд
            });
            return count;
        } catch (e) {
            console.error('QueryRateLimitRequestRepository [countReqByIpAndUrl]', e);
            return 0;
        }
    }
}
