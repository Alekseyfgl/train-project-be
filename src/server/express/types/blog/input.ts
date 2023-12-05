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
    searchNameTerm: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type BlogQueryType = Partial<BlogQuery>;
