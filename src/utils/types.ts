export interface  TypeContent {
    category: string,
    createdAt : string,
    description: string,
    id:string,
    imagePublicId :string,
    imageUrl: string,
    owner: {
        email: string,
        id:string,
        name:string
    },
    price : number,
    rejectionReason: string,
    reviewedAt:string,
    reviewedBy :string,
    status :string,
    title : string,
    updatedAt:string
}

export interface TypeCategory {
    success : boolean,
    data : TypeContent[]
}

export interface TypeCategories {
    success : boolean,
    data : string[]
}

 export interface SearchResponse {
    success: boolean;
    data: TypeContent[];
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}