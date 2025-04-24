import { IImageService } from "../interfaces/IImageService";
import { ImageGenerationParams, ImageGenerationResult } from "../types";
import { ModelRegistry } from "../models/ModelRegistry";

export class ImageService implements IImageService {
  private modelRegistry: ModelRegistry;

  constructor(modelRegistry: ModelRegistry) {
    this.modelRegistry = modelRegistry;
  }

  async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const { model } = params;
    const strategy = this.modelRegistry.get(model);
    return strategy.generate(params);
  }
}