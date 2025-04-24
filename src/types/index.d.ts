export type ImageGenerationParams = {
    prompt: string;
    n?: number;
    size?: string;
    model?: string;
    quality?: string;
  };
  export type ImageGenerationResult = {
    rawUrl: string;
    [key: string]: any;
  };