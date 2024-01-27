import { CommandRateLimitRequestRepository } from '../repositories/rate-limit-request/command-rate-limit-request.repository';

export class RateLimitRequestService {
    static async saveIpAndUrl(ip: string, url: string) {
        return CommandRateLimitRequestRepository.create({ ip, url });
    }
}
