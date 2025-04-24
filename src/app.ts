import express from "express";
import cors from "cors";
import morgan from "morgan";
import { imageRoutes } from "./routes/imageRoutes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", imageRoutes);
app.use("/saved", express.static(path.join(__dirname, "..", "saved"))); // One dir up (root)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads"))); // (optional: serve uploads)
// ------------

const swaggerFilePath = path.join(__dirname, "..", "swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Optional: root endpoint with info
app.get("/", (req, res) => {
  res.send(
    `<h2>Welcome to the OpenAI Image API!</h2><p>See <a href="/docs">/docs</a> for the Swagger UI.</p>`
  );
});

export default app;