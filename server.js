
import express from "express";
import { InferenceClient } from "@huggingface/inference";

const app = express();

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://93833kileshakilesh-ctrl.github.io"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AKI MAGIC AI Server is running!");
});

app.post("/generate-video", async (req, res) => {
  try {
    const prompt = req.body.prompt?.trim();

    if (!prompt) {
      return res.status(400).json({ error: "Please enter a prompt." });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ error: "HF_TOKEN is missing." });
    }

    const client = new InferenceClient(process.env.HF_TOKEN);

    const video = await client.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: prompt
    });

    res.type("mp4").send(Buffer.from(await video.arrayBuffer()));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Video generation failed."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



