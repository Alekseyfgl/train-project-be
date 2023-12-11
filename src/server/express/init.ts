import { MongooseInstance } from '../db/mongo';

class Init {
    public async start(): Promise<boolean> {
        const initial: boolean[] = [];
        // ----- for init -------
        //init Mongo
        initial.push(await this.initMongoDb());

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
