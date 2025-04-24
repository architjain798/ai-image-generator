# OpenAI Image API (TypeScript, Express)

A robust TypeScript Express REST API for generating, editing, and varying images using OpenAI DALL·E.

---

## 📦 Folder Structure

```
project-root/
├── src/
├── saved/
├── uploads/
├── swagger.json
├── postman_collection.json
├── .env
├── package.json
├── tsconfig.json
```

---

## 🚀 Quick Start

1. `npm install`
2. Add your `.env`:
   ```
   OPENAI_API_KEY=sk-yourkeyhere
   PORT=3000
   ```
3. `npm run build && npm start`
4. Open [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🛠️ API Endpoints

| Method | Endpoint                | Description                        |
|--------|------------------------|------------------------------------|
| GET    | `/api/health`          | Health check                       |
| POST   | `/api/generate-image`  | Generate new image from prompt     |
| POST   | `/api/edit-image`      | Edit uploaded image w/ prompt      |
| POST   | `/api/generate-variations` | Generate variations of image   |
| GET    | `/api/history`         | Last 20 image-related jobs         |
| GET    | `/api/image/:id`       | Show job details by ID             |

### Example: `/api/generate-image`

**POST** request body:
```json
{
  "prompt": "A dragon reading a book",
  "model": "dall-e-3",
  "quality": "hd",
  "size": "1024x1024",
  "n": 1
}
```

---

## 🧩 Swagger & Postman

Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

Postman: Import `postman_collection.json`.

---

## 📂 Saved Images

All generated images are saved in `/saved`, served from `/saved/filename.png`.

---

## 🛡️ Logging

- HTTP logs: `morgan`
- Debug/info logs in controllers/services

---

## 🗒️ Extending

- Swap in-memory history for DB.
- Swap local storage for S3/etc.
- Add auth/rate limits as needed.

---

## 📝 License

MIT. Contributions welcome!