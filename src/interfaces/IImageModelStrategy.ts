import { ImageGenerationParams, ImageGenerationResult } from '../types';

export interface IImageModelStrategy {
  generate(params: ImageGenerationParams): Promise<ImageGenerationResult>;
}