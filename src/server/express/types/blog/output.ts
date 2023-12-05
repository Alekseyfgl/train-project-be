export interface IBlog {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
}

export interface IBlogModel extends Document {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IBlogModelOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IBlogModel[];
}
