import { Request, Response } from "express";
import { ImageService } from "../services/ImageService";
import { FileUtil } from "../utils/FileUtil";
import { ImageGenerationParams } from "../types";

export class ImageController {
  private imageService: ImageService;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  async generateImage(req: Request, res: Response): Promise<void> {
    const params: ImageGenerationParams = req.body;
    if (!params.prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }
    try {
      const { rawUrl } = await this.imageService.generateImage(params);

      // Save the image file permanently
      const savedPath = await FileUtil.downloadAndSave(rawUrl, params.prompt);

      res.status(201).json({
        ...params,
        openai_url: rawUrl,
        saved_path: savedPath,
      });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
}