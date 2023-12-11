import { Nullable } from '../../common/interfaces/optional.types';

export interface AddBlogDto {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership?: boolean;
}

export interface UpdateBlogDto {
    name: string;
    description: string;
    websiteUrl: string;
}

export interface BlogQuery {
    searchNameTerm: Nullable<string>;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type BlogQueryTypeOptional = Partial<BlogQuery>;
