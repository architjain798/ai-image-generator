import { Router } from "express";
import { ImageController } from "../controllers/ImageController";
import { ImageService } from "../services/ImageService";
import { ModelRegistry } from "../models/ModelRegistry";
import { OpenAI } from "openai";

// Dependency Injection (SRP)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const modelRegistry = new ModelRegistry(openai);
const imageService = new ImageService(modelRegistry);
const imageController = new ImageController(imageService);

export const imageRoutes = Router();

// Add endpoints; for brevity, only /generate-image example:
imageRoutes.post("/generate-image", (req, res) => imageController.generateImage(req, res));