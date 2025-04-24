import { IImageModelStrategy } from "../interfaces/IImageModelStrategy";
import { OpenAI } from "openai";
import { DalleV2Strategy } from "./DalleV2Strategy";
import { DalleV3Strategy } from "./DalleV3Strategy";

export class ModelRegistry {
  private strategies: Record<string, IImageModelStrategy>;

  constructor(openai: OpenAI) {
    this.strategies = {
      "dall-e-2": new DalleV2Strategy(openai),
      "dall-e-3": new DalleV3Strategy(openai),
    };
  }

  get(model: string = "dall-e-3"): IImageModelStrategy {
    return this.strategies[model] || this.strategies["dall-e-3"];
  }
}