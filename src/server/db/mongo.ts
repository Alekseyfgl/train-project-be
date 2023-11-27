import * as mongoose from 'mongoose';
import { Connection, Mongoose } from 'mongoose';
import { Nullable, Optional } from '../express/common/interfaces/optional.types';
import * as dotenv from 'dotenv';

dotenv.config();
export const AVAILABLE_RESOLUTIONS = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const;

const uri = (process.env.MONGODB_URI as string) || 'mongodb://localhost:27017/train_project_be_local';
export class MongooseInstance {
    private static instance: Nullable<Mongoose> = null;
    private static uri: string = uri;

    private constructor() {}

    public static async connect() {
        if (!this.instance) {
            try {
                this.instance = await mongoose.connect(MongooseInstance.uri, {
                    // connectTimeoutMS: 5000,
                    // serverSelectionTimeoutMS: 5000,
                });
                this.connectManager();
            } catch (e) {
                await mongoose.disconnect();
                console.error(e);
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

// export const rowQueryForMongoWithMongoose = async () => {
//     const collections = mongoose.connection.db.collection('movies');
//
//     const r = await collections.find({}).toArray();
//     console.log(r);
// };
