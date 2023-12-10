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

interface BlogQuery {
    searchNameTerm: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type BlogQueryTypeOptional = Partial<BlogQuery>;

export interface PostsByBlogQuery {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type PostsByBlogQueryOptional = Partial<PostsByBlogQuery>;
