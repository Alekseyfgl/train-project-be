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
