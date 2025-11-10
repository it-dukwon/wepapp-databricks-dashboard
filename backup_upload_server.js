const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { DataLakeServiceClient } = require("@azure/storage-file-datalake");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("xlsFile"), async (req, res) => {
    const filePath = req.file.path;

  // 파일명 정제 + 날짜시간 추가
    const dayjs = require("dayjs");
    const timezone = require("dayjs/plugin/timezone");
    const utc = require("dayjs/plugin/utc");
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const KST = dayjs().tz("Asia/Seoul").format("YYYYMMDD_HHmmss"); // 한국 시간 기준

    const originalName = req.file.originalname;
    const baseName = path.basename(originalName, path.extname(originalName));
    const ext = path.extname(originalName);

// 파일명 정제: 한글/공백/특수문자 제거, 너무 긴 이름 방지
const cleanBase = baseName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30); // 최대 30자
const fileName = `${KST}_${cleanBase}${ext}`;

  try {
    const serviceClient = DataLakeServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const fileSystemClient = serviceClient.getFileSystemClient(process.env.AZURE_STORAGE_CONTAINER);

    const exists = await fileSystemClient.exists();
    console.log("File system exists:", exists);
    if (!exists) {
      return res.status(400).json({ message: "❌ File system does not exist." });
    }

    const fileClient = fileSystemClient.getFileClient(fileName);

    await fileClient.create();
    const fileContent = fs.readFileSync(filePath);
    await fileClient.append(fileContent, 0, fileContent.length);
    await fileClient.flush(fileContent.length);

    fs.unlinkSync(filePath);
    res.json({ message: "✅ 업로드 성공!", fileName });
  } catch (err) {
    console.error("❌ 업로드 실패:", err.message);
    res.status(500).json({ message: "❌ 업로드 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});