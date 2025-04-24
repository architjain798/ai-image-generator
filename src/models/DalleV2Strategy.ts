// src/models/DalleV2Strategy.ts
import { IImageModelStrategy } from "../interfaces/IImageModelStrategy";
import { ImageGenerationParams, ImageGenerationResult } from "../types";
import { OpenAI } from "openai";

// Allowed by OpenAI for "size"
const allowedSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792', '1536x1024', '1024x1536', 'auto'] as const;
type AllowedSize = typeof allowedSizes[number];

export class DalleV2Strategy implements IImageModelStrategy {
  private openai: OpenAI;

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async generate(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const { prompt, n = 1, size = "1024x1024" } = params;
    const cleanSize: AllowedSize = allowedSizes.includes(size as AllowedSize) ? size as AllowedSize : "1024x1024";
    const response = await this.openai.images.generate({
      model: "dall-e-2",
      prompt,
      n,
      size: cleanSize,
    });

    if (!response.data?.[0]?.url) throw new Error("No image URL returned from OpenAI.");
    return { rawUrl: response.data[0].url };
  }
}