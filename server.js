
import express from "express";
import { InferenceClient } from "@huggingface/inference";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AKI MAGIC AI Server is running!");
});

app.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Please enter a video prompt." });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ error: "HF_TOKEN is missing on Render." });
    }

    const client = new InferenceClient(process.env.HF_TOKEN);

    const video = await client.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: prompt
    });

    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.from(await video.arrayBuffer()));
  } catch (error) {
    console.error("Video generation error:", error);
    res.status(500).json({
      error: "Video generation failed. Check provider access, credits, and model availability."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


