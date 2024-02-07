import { IUser } from '../types/user/output';
import jwt from 'jsonwebtoken';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IJwtPayload } from '../types/auth/input';
import { setMilliseconds } from 'date-fns';

export class JwtService {
    /**
     *
     * @param user
     * @param expiresIn
     * @param issuedAt - in seconds
     * @param deviceId
     */
    static async createJwt(user: IUser, expiresIn: number, issuedAt: Date, deviceId: Nullable<string>): Promise<string> {
        const secret = process.env.JWT_SECRET as string;
        const iat: number = Math.floor(+issuedAt / 1000); // remove milliseconds
        const userId: string = user.id;
        return jwt.sign({ userId, deviceId, iat }, secret, { expiresIn });
    }

    static async verifyToken(token: string): PromiseNull<IJwtPayload> {
        try {
            const verifiedToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as IJwtPayload;
            if (!verifiedToken) return null;

            return verifiedToken;
        } catch (e) {
            console.log('[getUserIdByToken]', e);
            return null;
        }
    }

    static compareDate(iat: number, sessionCreatedAt: number) {
        const removedMilliseconds: number = Math.floor(+sessionCreatedAt / 1000);
        return iat === removedMilliseconds;
    }

    static get iat(): Date {
        return setMilliseconds(new Date(), 0) as Date;
    }
}
