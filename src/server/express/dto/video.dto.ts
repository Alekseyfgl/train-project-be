import { AvailableResolutionsType } from '../repositories/video.repository';
import { Nullable } from '../common/types/optional.types';

export type AddVideoDto = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutionsType[];
};

export type VideoUpdateDto = {
    title: string;
    author: string;
    availableResolutions: AvailableResolutionsType[];
    canBeDownloaded: boolean;
    minAgeRestriction: Nullable<number>;
    publicationDate: string;
};
