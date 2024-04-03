import * as mongoose from 'mongoose';
import { Connection, Mongoose } from 'mongoose';
import { Nullable, Optional } from '../express/common/interfaces/optional.types';
import * as dotenv from 'dotenv';

dotenv.config();

export class MongooseInstance {
    private static instance: Nullable<Mongoose> = null;
    private static uri: string = (process.env.MONGO_LOCAL as string) || 'mongodb://localhost:27017/train_project_be_local';

    private constructor() {}

    public static async connect() {
        if (!this.instance) {
            try {
                this.instance = await mongoose.connect(MongooseInstance.uri, {
                    connectTimeoutMS: 3000,
                    serverSelectionTimeoutMS: 3000,
                });
                this.connectManager();
                return true;
            } catch (e) {
                await mongoose.disconnect();
                console.error(e);
                return false;
            }
        }
        return this.instance;
    }

    private static connectManager() {
        const inst: Optional<Connection> = MongooseInstance.instance?.connection;

        inst?.on('connected', () => {
            console.log('Mongo was connected successfully, after disconnected');
        });
        inst?.on('disconnected', () => {
            console.error('Mongo was disconnected');
        });
        inst?.on('error', (error) => {
            console.error(error);
        });
    }
}
