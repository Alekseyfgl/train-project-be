import { VideoType } from '../express/types/video/output';
import { IBlog } from '../express/types/blog/output';
import { IPost } from '../express/types/post/output';
import * as mongoose from 'mongoose';
import { Connection, Mongoose } from 'mongoose';
import { Nullable, Optional } from '../express/common/interfaces/optional.types';

require('dotenv').config();
export const AVAILABLE_RESOLUTIONS = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const;

type DBType = {
    videos: VideoType[];
    blogs: IBlog[];
    posts: IPost[];
};

export const mongo: DBType = {
    videos: [
        // {
        //     id: 1,
        //     title: 'string',
        //     author: 'string',
        //     canBeDownloaded: true,
        //     minAgeRestriction: null,
        //     createdAt: '2023-11-12T11:37:53.947Z',
        //     publicationDate: '2023-11-12T11:37:53.947Z',
        //     availableResolutions: ['P144'],
        // },
    ],
    blogs: [
        // {
        //     id: '1',
        //     name: 'string',
        //     description: 'string',
        //     websiteUrl: 'string',
        // },
    ],
    posts: [],
};

export class MongooseInstance {
    private static instance: Nullable<Mongoose> = null;
    private static uri: string = process.env.NODE_ENV === 'production' ? (process.env.MONGODB_URI_PRODUCTION as string) : (process.env.MONGODB_URI_LOCAL as string);

    private constructor() {}

    public static async connect() {
        if (!this.instance) {
            try {
                this.instance = await mongoose.connect(MongooseInstance.uri, {
                    connectTimeoutMS: 5000,
                    serverSelectionTimeoutMS: 5000,
                });
                this.connectManager();
            } catch (e) {
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
