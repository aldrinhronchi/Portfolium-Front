export interface RequestViewModel<T> {
    Data: T[];
    Type: string;
    Page?: number;
    PageSize?: number;
    PageCount?: number;
    Status?: string;
    Message?: string;
   
}