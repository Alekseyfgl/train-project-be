import { VideoType } from '../express/types/video/output';
import { IBlog } from '../express/types/blog/output';

export const AVAILABLE_RESOLUTIONS = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const;

type DBType = {
    videos: VideoType[];
    blogs: IBlog[];
};

export const db: DBType = {
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
};
