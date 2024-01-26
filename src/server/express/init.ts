import { MongooseInstance } from '../db/mongo';
import ip from 'ip';
import dotenv from 'dotenv';

dotenv.config();
class Init {
    public async start(): Promise<boolean> {
        const initial: boolean[] = [];
        // ----- for init -------
        //init Mongo
        initial.push(await this.initMongoDb());

        const networkInterfaces = ip.address(); // my ip address
        console.log('Server ip: ', `${networkInterfaces}:${process.env.SERVER_PORT as string}`);
        // ===== for init ========
        //return result init
        return initial.every((el) => el);
    }

    private async initMongoDb(): Promise<boolean> {
        const isConnect = await MongooseInstance.connect();
        if (isConnect) {
            console.log('Successfully connected to MongoDB');
            return true;
        } else {
            console.error('Failed to connect to MongoDB');
            return false;
        }
    }
}

export const init = new Init();
