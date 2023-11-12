import { Nullable } from '../common/types/optional.types';

export const AVAILABLE_RESOLUTIONS = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const;
export type AvailableResolutionsType = (typeof AVAILABLE_RESOLUTIONS)[number];

export type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: Nullable<number>;
    createdAt: string;
    publicationDate: string;
    availableResolutions: AvailableResolutionsType[];
};

export const videos: VideoType[] = [
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
];
