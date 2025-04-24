import fs from "fs";
import path from "path";
import axios from "axios";

export class FileUtil {
  static async downloadAndSave(url: string, prompt: string): Promise<string> {
    const SAVED_DIR = path.join(__dirname, "..", "saved");
    if (!fs.existsSync(SAVED_DIR))
      fs.mkdirSync(SAVED_DIR, { recursive: true });

    const safePrompt = prompt.replace(/[^a-z0-9]/gi, "_").substring(0, 32);
    const filename = `image_${safePrompt}_${Date.now()}.png`;
    const filepath = path.join(SAVED_DIR, filename);

    const imgResp = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filepath, imgResp.data);
    return `/saved/${filename}`;
  }
}