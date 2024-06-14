export interface IGenericErrorResponseType {
    errorMessage?: string | undefined;
    errorDetails: Record<string, any>
  }