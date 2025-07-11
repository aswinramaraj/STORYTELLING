import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import { generate } from "./Generate.js";
dotenv.config();
import textToSpeech from "@google-cloud/text-to-speech";
import ffmpeg from "fluent-ffmpeg";
import util from "util";
const client = new textToSpeech.TextToSpeechClient();
const writeFile = util.promisify(fs.writeFile);


const synthesizeAudio = async (text, index) => {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "mp3" },
  };
  const [response] = await client.synthesizeSpeech(request);
  const outputPath = path.join("output", `audio_${index}.mp3`);
  await writeFile(outputPath, response.audioContent, "binary");
  return outputPath;
};

const createSceneVideo = async (image, audio, output) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(image)
      .loop()
      .addInput(audio)
      .outputOptions(["-shortest", "-c:v libx264", "-pix_fmt yuv420p", "-c:a aac"])
      .save(output)
      .on("end", () => resolve(output))
      .on("error", reject);
  });
};

export const stitchvideo = async (video_script, imagePaths) => {
  const sceneVideos = [];

  for (let i = 0; i < video_script.length; i++) {
    const audioPath = await synthesizeAudio(video_script[i], i);
    const sceneVideo = path.join("output", `scene_${i}.mp4`);
    await createSceneVideo(imagePaths[i], audioPath, sceneVideo);
    sceneVideos.push(sceneVideo);
  }

  const concatListPath = path.join("output", "concat_list.txt");
  fs.writeFileSync(concatListPath, sceneVideos.map(p => `file '${p}'`).join("\n"));

  const finalVideoPath = path.join("output", "final_story_video.mp4");

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(concatListPath)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c copy"])
      .save(finalVideoPath)
      .on("end", () => resolve(finalVideoPath))
      .on("error", reject);
  });
};









// 🔧 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload helper
const uploadToCloudinary = async (localFilePath, category = "general", metadata = {}) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: category,
      tags: [category],
      context: Object.entries(metadata).map(([key, val]) => `${key}=${val}`),
    });
    console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      category: category,
      metadata: metadata,
    };
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    return null;
  }
};

const HF_TOKEN = process.env.huggingface_token;

// 🧠 Generate image using base64 Hugging Face model
const generateImage = async (prompt, outputFile) => {
  const response = await axios.post(
    "https://router.huggingface.co/nebius/v1/images/generations",
    {
      response_format: "b64_json",
      prompt,
      model: "black-forest-labs/flux-schnell",
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const b64 = response?.data?.data?.[0]?.b64_json;
  if (!b64) {
    console.error("❌ Hugging Face Error:", response?.data);
    return null;
  }

  const buffer = Buffer.from(b64, "base64");
  const type = await fileTypeFromBuffer(buffer);

  if (type?.mime?.startsWith("image/")) {
    fs.writeFileSync(outputFile, buffer);
    return outputFile;
  } else {
    console.error("❌ Invalid image type.");
    return null;
  }
};

// 🎬 Main generate video logic
const generatevideo = async (req, res) => {
  try {
    const { story, video_script } = req.body;
    console.log("🎥 Generating video scenes...");

    if (!video_script || !Array.isArray(video_script)) {
      return res.status(400).json({ error: "video_script must be an array" });
    }

    const hostedImageUrls = [];
    const outputPaths = [];

    for (let i = 0; i < video_script.length; i++) {
      const prompt = video_script[i];
      const filename = `scene_${i}.png`;
      const localPath = path.join("output", filename);

      const savedPath = await generateImage(prompt, localPath);
      if (!savedPath) continue;

      outputPaths.push(localPath); // ✅ Save local path

      const cloudinaryRes = await uploadToCloudinary(savedPath, story || "video-scenes", {
        scene: i,
        prompt,
      });

      if (cloudinaryRes?.url) {
        hostedImageUrls.push(cloudinaryRes.url);
        // fs.unlinkSync(savedPath); // ❌ Remove only if you don't want to keep locally
      }
    }

    const finalVideoPath = await stitchvideo(video_script, outputPaths);

    if (!finalVideoPath) {
      return res.status(500).json({ error: "❌ Failed to create final video" });
    }

    // 🎉 Step 3: Return or download the final video
    res.download(finalVideoPath);

    res.status(200).json({
      message: "🎉 Images generated & uploaded",
      local_paths: outputPaths,
      hosted_urls: hostedImageUrls,
      
    });
  } catch (err) {
    console.error("❌ Error generating video:", err);
    res.status(500).json({ error: "Server error during video generation" });
  }
};

export { generatevideo };
