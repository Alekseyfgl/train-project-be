import { Nullable } from '../../common/interfaces/optional.types';
import { AVAILABLE_RESOLUTIONS } from '../../../db/mongo';

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
