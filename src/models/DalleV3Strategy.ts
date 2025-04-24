// src/models/DalleV3Strategy.ts
import { IImageModelStrategy } from "../interfaces/IImageModelStrategy";
import { ImageGenerationParams, ImageGenerationResult } from "../types";
import { OpenAI } from "openai";

// Allowed for "quality"
const allowedQualities = ['standard', 'hd', 'low', 'medium', 'high', 'auto'] as const;
type AllowedQuality = typeof allowedQualities[number];

// Allowed sizes as above
const allowedSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792', '1536x1024', '1024x1536', 'auto'] as const;
type AllowedSize = typeof allowedSizes[number];

export class DalleV3Strategy implements IImageModelStrategy {
  private openai: OpenAI;

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async generate(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const { prompt, quality = "standard", size = "1024x1024" } = params;
    const cleanQuality: AllowedQuality = allowedQualities.includes(quality as AllowedQuality) ? quality as AllowedQuality : "standard";
    const cleanSize: AllowedSize = allowedSizes.includes(size as AllowedSize) ? size as AllowedSize : "1024x1024";
    const response = await this.openai.images.generate({
      model: "dall-e-3",
      prompt,
      quality: cleanQuality,
      size: cleanSize,
    });

    if (!response.data?.[0]?.url) throw new Error("No image URL returned from OpenAI.");
    return { rawUrl: response.data[0].url };
  }
}