import multer from "multer";
import { AppError } from "./customError.utils";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed", StatusCodes.BAD_REQUEST));
    }
  },
});
