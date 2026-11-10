const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // this equate to 5MB and NOT 5GB
  },
});

const upload = multer({ storage });

module.exports = upload;
