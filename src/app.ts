import express from "express";
import cors from "cors";
import morgan from "morgan";
import { imageRoutes } from "./routes/imageRoutes";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", imageRoutes);
app.use("/saved", express.static(path.join(__dirname, "saved")));
export default app;