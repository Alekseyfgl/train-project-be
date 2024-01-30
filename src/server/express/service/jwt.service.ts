import { IUser } from '../types/user/output';
import jwt from 'jsonwebtoken';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IJwtPayload } from '../types/auth/input';
import { addMilliseconds } from 'date-fns';

export class JwtService {
    /**
     *
     * @param user
     * @param expiresIn
     * @param issuedAt
     * @param deviceId
     */
    static async createJwt(user: IUser, expiresIn: number, issuedAt: Date, deviceId: Nullable<string>): Promise<string> {
        const secret = process.env.JWT_SECRET as string;
        const iat: number = +issuedAt;
        const userId: string = user.id;
        return jwt.sign({ userId, deviceId, iat }, secret, { expiresIn });
    }

    static async verifyToken(token: string): PromiseNull<IJwtPayload> {
        try {
            const dataFromToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as IJwtPayload;
            if (!dataFromToken?.iat) return null;

            const isExpired: boolean = this.isExpiredToken(dataFromToken.iat);
            if (!isExpired) return null;

            return dataFromToken;
        } catch (e) {
            console.log('[getUserIdByToken]', e);
            return null;
        }
    }
    private static isExpiredToken(tokenIssuedAt: number): boolean {
        const iat: Date = new Date(tokenIssuedAt);

        const _refreshToken = +process.env.REFRESH_TOKEN_EXP! as number;
        const expAt: Date = addMilliseconds(iat, _refreshToken);
        return new Date() <= expAt;
    }
}
