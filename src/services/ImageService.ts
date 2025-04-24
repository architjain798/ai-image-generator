import { ModelRegistry } from '../models/ModelRegistry';
import { ImageGenerationParams, ImageGenerationResult } from '../types';
import { OpenAI } from 'openai';
import fs from 'fs';

export class ImageService {
  private modelRegistry: ModelRegistry;
  private openai: OpenAI;

  constructor(modelRegistry: ModelRegistry, openai: OpenAI) {
    this.modelRegistry = modelRegistry;
    this.openai = openai;
  }

  /**
   * Generate image using a model-strategy
   */
  async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const model = params.model || 'dall-e-3';
    const strategy = this.modelRegistry.get(model);
    return strategy.generate(params);
  }

  /**
   * Edit an uploaded image with a prompt (DALL·E only)
   */
  async editImage(filePath: string, prompt: string): Promise<{ rawUrl: string }> {
    // Edit only supported by DALL·E models in OpenAI for now.
    // filePath: absolute path to PNG on disk
    const response = await this.openai.images.edit({
      image: fs.createReadStream(filePath),
      prompt,
      n: 1,
      size: '1024x1024'
    });
    if (!response.data?.[0]?.url) throw new Error('No edited image url returned');
    return { rawUrl: response.data[0].url };
  }

  /**
   * Generate N variations of an uploaded image (DALL·E only)
   */
  async generateVariations(filePath: string): Promise<string[]> {
    // Variations only supported by DALL·E models in OpenAI for now
    const response = await this.openai.images.createVariation({
      image: fs.createReadStream(filePath),
      n: 3,
      size: '1024x1024'
    });
    if (!response.data?.length) throw new Error('No variation image urls returned');
    return response.data.map(d => d.url!).filter(Boolean);
  }
}