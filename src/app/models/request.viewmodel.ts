/**
 * Interface para dados de requisição padronizado e generico 
 */
export interface RequestViewModel<T> {
    Data: T[];
    Type: string;
    Page?: number;
    PageSize?: number;
    PageCount?: number;
    Status?: string;
    Message?: string;
   
}