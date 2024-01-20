import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { ITokenBlacklistSchema } from '../../types/token-blacklist/output';
import { TokenBlacklistModel } from '../../models/token-blacklist.model';

export class QueryTokenBlacklistRepository {
    static async findByToken(token: string): PromiseNull<ITokenBlacklistSchema> {
        try {
            const tokenSchema: Nullable<ITokenBlacklistSchema> = await TokenBlacklistModel.findOne({ token });
            if (!tokenSchema) return null;

            return tokenSchema;
        } catch (e) {
            console.error('QueryTokenBlacklistRepository [findByToken]', e);
            return null;
        }
    }
}
