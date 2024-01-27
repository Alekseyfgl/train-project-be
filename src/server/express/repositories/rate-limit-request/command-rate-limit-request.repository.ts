import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { RateLimitRequestModel } from '../../models/rate-limit-request.model';
import { IRateLimitRequestSchema } from '../../types/rate-limit-request/output';
import { RateLimitDto } from '../../types/rate-limit-request/input';

export class CommandRateLimitRequestRepository {
    static async create(dto: RateLimitDto): PromiseNull<IRateLimitRequestSchema> {
        try {
            const createdRateLimit: Nullable<IRateLimitRequestSchema> = await RateLimitRequestModel.create(dto);
            if (!createdRateLimit) return null;

            return createdRateLimit;
        } catch (e) {
            console.error('CommandRateLimitRequestRepository [create]', e);
            return null;
        }
    }
}
