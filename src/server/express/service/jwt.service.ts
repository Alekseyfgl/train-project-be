import { IUser } from '../types/user/output';
import jwt from 'jsonwebtoken';
import { PromiseNull } from '../common/interfaces/optional.types';
import { IJwtPayload } from '../types/auth/input';

export class JwtService {
    static async createJwt(user: IUser, expiresIn: string): Promise<string> {
        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: expiresIn });
    }

    static async verifyToken(token: string): PromiseNull<IJwtPayload> {
        try {
            const dataFromToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as IJwtPayload;

            return dataFromToken;
        } catch (e) {
            console.log('[getUserIdByToken]', e);
            return null;
        }
    }
}
