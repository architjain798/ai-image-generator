import { Request, Response, NextFunction } from "express";
import { ImageService } from "../services/ImageService";
import { FileUtil } from "../utils/FileUtil";

type JobRecord = {
  id: number;
  type: string;
  params: any;
  openai_url?: string;
  openai_urls?: string[];
  saved_path?: string | string[];
  createdAt: string;
};

export class ImageController {
  private imageService: ImageService;
  private static history: JobRecord[] = [];
  private static idCounter = 1;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  // 1. Health Check
  health(req: Request, res: Response, next: NextFunction): void {
    res.json({ status: "ok", time: new Date().toISOString() });
  }

  // 2. Generate Image from prompt
  async generateImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = req.body;
    if (!params.prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    try {
      const { rawUrl } = await this.imageService.generateImage(params);

      // Download and save
      const savedPath = await FileUtil.downloadAndSave(rawUrl, params.prompt);

      const record: JobRecord = {
        id: ImageController.idCounter++,
        type: "generate",
        params,
        openai_url: rawUrl,
        saved_path: savedPath,
        createdAt: new Date().toISOString(),
      };
      ImageController.history.push(record);

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }

  // 3. Edit Image
  async editImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.file || !req.body.prompt) {
      res.status(400).json({ error: "Image file and prompt are required" });
      return;
    }
    const prompt = req.body.prompt;
    const filePath = req.file.path;
    try {
      const { rawUrl } = await this.imageService.editImage(filePath, prompt);

      // If you want to download the edited image, uncomment:
      // const savedPath = await FileUtil.downloadAndSave(rawUrl, prompt);

      const record: JobRecord = {
        id: ImageController.idCounter++,
        type: "edit",
        params: { prompt },
        openai_url: rawUrl,
        // saved_path: savedPath, // Uncomment if you also save locally
        createdAt: new Date().toISOString(),
      };
      ImageController.history.push(record);

      // Clean up uploaded file
      FileUtil.removeFile(filePath);

      res.status(201).json(record);
    } catch (err) {
      FileUtil.removeFile(filePath);
      next(err);
    }
  }

  // 4. Generate Variations
  async generateVariations(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }
    const filePath = req.file.path;
    try {
      const urls = await this.imageService.generateVariations(filePath);

      // If you'd like, also download and save all variation images here.

      const record: JobRecord = {
        id: ImageController.idCounter++,
        type: "variation",
        params: {},
        openai_urls: urls,
        createdAt: new Date().toISOString(),
      };
      ImageController.history.push(record);

      FileUtil.removeFile(filePath);

      res.status(201).json(record);
    } catch (err) {
      FileUtil.removeFile(filePath);
      next(err);
    }
  }

  // 5. Get History
  getHistory(req: Request, res: Response, next: NextFunction): void {
    res.json(ImageController.history.slice(-20).reverse());
  }

  // 6. Get op by ID
  getImageById(req: Request, res: Response, next: NextFunction): void {
    const id = Number(req.params.id);
    const record = ImageController.history.find(item => item.id === id);
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  }
}