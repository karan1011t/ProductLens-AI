export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface ImageFile {
  file: File;
  preview: string;
  base64: string; // Pure base64 without prefix
  mimeType: string;
}

export enum ViewState {
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT'
}