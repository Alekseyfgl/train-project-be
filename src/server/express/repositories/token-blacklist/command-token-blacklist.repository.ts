import { PromiseNull } from '../../common/interfaces/optional.types';
import { TokenBlacklistModel } from '../../models/token-blacklist.model';
import { ITokenBlacklistSchema } from '../../types/token-blacklist/output';

export class CommandTokenBlacklistRepository {
    static async create(token: string): PromiseNull<ITokenBlacklistSchema> {
        try {
            return await TokenBlacklistModel.create({ token: token });
        } catch (e) {
            console.error('CommandTokenBlacklistRepository [create]', e);
            return null;
        }
    }
}
