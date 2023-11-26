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
    createdAt: string;
    isMembership: boolean;
}
