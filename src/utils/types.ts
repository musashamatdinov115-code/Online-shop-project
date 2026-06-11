export interface  typeContent {
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