import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.get("/api/og-image/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch the post details
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
    const post = await response.json();

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load and customize the template
    const templatePath = path.join(__dirname, "og-template.html");
    let template = fs.readFileSync(templatePath, "utf8");
    template = template.replace("{{postTitle}}", post.title);
    template = template.replace("{{postedBy}}", post.postedBy || "Anonymous");
    template = template.replace(
      "{{postImageUrl}}",
      post.img || "https://example.com/default-image.jpg"
    );

    await page.setContent(template);
    await page.setViewport({ width: 1200, height: 630 });

    // Capture the screenshot
    const screenshot = await page.screenshot({ type: "jpeg", quality: 90 });

    await browser.close();

    // Set content-type and send the image
    res.set("Content-Type", "image/jpeg");
    res.send(screenshot);
  } catch (error) {
    console.error("Error generating OG image:", error);
    res.status(500).send("Error generating OG image");
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
