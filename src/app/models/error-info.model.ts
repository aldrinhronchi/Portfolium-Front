/**
 * Interface para dados de erro padronizado e generico
 */
export interface ErrorInfo {
  Message: string;
  Title?: string;
  StatusCode?: number;
  Details?: string;
} 