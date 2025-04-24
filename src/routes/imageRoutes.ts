import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { ImageController } from "../controllers/ImageController";
import { ImageService } from "../services/ImageService";
import { ModelRegistry } from "../models/ModelRegistry";
import { OpenAI } from "openai";

// Dependency injection setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const modelRegistry = new ModelRegistry(openai);
const imageService = new ImageService(modelRegistry, openai);
const imageController = new ImageController(imageService);

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Universal catchAsync wrapper for async controllers
function catchAsync(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

const router = Router();

// Health check
router.get("/health", (req: Request, res: Response, next: NextFunction) =>
  imageController.health(req, res, next)
);

// Generate image
router.post(
  "/generate-image",
  catchAsync((req: Request, res: Response, next: NextFunction) =>
    imageController.generateImage(req, res, next)
  )
);

// Edit image
router.post(
  "/edit-image",
  upload.single("image"),
  catchAsync((req: Request, res: Response, next: NextFunction) =>
    imageController.editImage(req, res, next)
  )
);

// Generate variations
router.post(
  "/generate-variations",
  upload.single("image"),
  catchAsync((req: Request, res: Response, next: NextFunction) =>
    imageController.generateVariations(req, res, next)
  )
);

// History
router.get(
  "/history",
  catchAsync((req: Request, res: Response, next: NextFunction) =>
    imageController.getHistory(req, res, next)
  )
);

// Get by id
router.get(
  "/image/:id",
  catchAsync((req: Request, res: Response, next: NextFunction) =>
    imageController.getImageById(req, res, next)
  )
);

export { router as imageRoutes };