import { MongooseInstance } from '../db/mongo';

class Init {
    public async start(): Promise<boolean> {
        const initial: boolean[] = [];
        // ----- for init -------
        //init Mongo
        initial.push(await this.initMongoDb());

        // ===== for init ========
        //return result init
        return initial.every(Boolean);
    }

    private async initMongoDb(): Promise<boolean> {
        return MongooseInstance.connect()
            .then(() => {
                console.log('Successfully connected to MongoDB');
                return true;
            })
            .catch((error) => {
                console.error('Failed to connect to MongoDB', error);
                return false;
            });
    }
}

export const init = new Init();
