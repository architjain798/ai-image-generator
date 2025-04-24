import { ImageGenerationParams, ImageGenerationResult } from '../types';

export interface IImageService {
  generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult>;
}