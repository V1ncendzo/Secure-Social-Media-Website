import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage });

// Middleware for validating file type
export const validateFileType = async (req, res, next) => {
  if (req.file) {
    const fileTypeResult = await fileTypeFromBuffer(req.file.buffer);
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileTypeResult?.mime)) {
      return res.status(400).json({ message: 'Unsupported file type. Only .jpg, .jpeg, and .png files are allowed.' });
    }
  }
  next();
};
