const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const dbConnect = require("./db/dbConnect");
const requireLogin = require("./middleware/requireLogin");

const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const AdminRouter = require("./routes/AdminRouter");

dbConnect();

app.use(
  cors({
    origin: "*", // Hãy đảm bảo URL này chính xác 100%
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Nếu bạn dùng JWT, thường nên để true hoặc bỏ qua
  })
);

// 2. XỬ LÝ OPTIONS PREFLIGHT (Bắt buộc cho mọi route)
app.options("*", cors());

app.use(express.json());

// Đảm bảo folder images tồn tại
const IMAGES_DIR = path.join(__dirname, "images");
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
app.use("/images", express.static(IMAGES_DIR));

app.use("/admin", AdminRouter);
app.use("/api/user", UserRouter);
app.use("/user", UserRouter);
app.use("/api/photo", requireLogin, PhotoRouter);
app.use("/photos", requireLogin, PhotoRouter);
app.use("/api/comment", requireLogin, CommentRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello from photo-sharing app AP111222111I!" });
});

// Phục vụ React build (production)
const CLIENT_BUILD = path.join(__dirname, "..", "client", "build");
if (fs.existsSync(CLIENT_BUILD)) {
  app.use(express.static(CLIENT_BUILD));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD, "index.html"));
  });
}

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
