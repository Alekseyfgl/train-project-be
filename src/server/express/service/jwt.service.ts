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

    static async verifyToken(token: string, type: 'access' | 'refresh' | 'confirm-email'): PromiseNull<IJwtPayload> {
        try {
            const dataFromToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as IJwtPayload;
            if (!dataFromToken?.iat) return null;

            const isExpired: boolean = await this.isExpiredToken(dataFromToken, type);
            if (!isExpired) return null;

            return dataFromToken;
        } catch (e) {
            console.log('[getUserIdByToken]', e);
            return null;
        }
    }

    private static async isExpiredToken(prevToken: IJwtPayload, type: 'access' | 'refresh' | 'confirm-email'): Promise<boolean> {
        const tokenIssuedAt = prevToken.iat;
        if (!tokenIssuedAt) return false;

        const iat: Date = new Date(tokenIssuedAt);
        let duration;
        switch (type) {
            case 'access':
                duration = +process.env.ACCESS_TOKEN_EXP! as number;
                break;
            case 'refresh':
                // const isEqualCreatedAt: boolean = await this.compareCreatedDate(prevToken);
                // if (!isEqualCreatedAt) return false;

                duration = +process.env.REFRESH_TOKEN_EXP! as number;
                break;
            case 'confirm-email':
                duration = +process.env.CONFIRMATION_TOKEN_EXP! as number;
                break;
        }

        const expAt: Date = addMilliseconds(iat, duration!);
        return new Date() < expAt; //if true - token is valid
    }
}
