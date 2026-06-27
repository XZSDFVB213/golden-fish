export interface ICategory{
    id: string;
    title: string;
    description: string;
    createdAt: string;
    storeId: string;
}
export interface ICategoryInput extends Pick<ICategory, 'title' | 'description'> {}