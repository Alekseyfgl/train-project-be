import { CommandTokenBlacklistRepository } from '../repositories/token-blacklist/command-token-blacklist.repository';

export class TokenBlacklistService {
    static async saveToken(token: string) {
        return CommandTokenBlacklistRepository.create(token);
    }
}
