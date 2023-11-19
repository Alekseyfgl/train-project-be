import { Nullable } from '../../common/interfaces/optional.types';
import { AvailableResolutionsType } from './output';

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
