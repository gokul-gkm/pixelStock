import { imageController } from "@/controllers/implements/image.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { upload } from "@/utils/multer.utils";
import { Router } from "express";

const imageRoute = Router();

imageRoute.post(
  "/upload",
  authMiddleware,
  upload.array("images", 20),
  asyncHandler(imageController.uploadImages),
);

imageRoute.get("/explore", asyncHandler(imageController.getPublicImages));

imageRoute.get("/", authMiddleware, asyncHandler(imageController.getImages));

imageRoute.patch("/reorder", authMiddleware, asyncHandler(imageController.reorderImages));

imageRoute.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  asyncHandler(imageController.updateImage),
);

imageRoute.patch("/:id/title", authMiddleware, asyncHandler(imageController.updateTitle));

imageRoute.patch("/:id/visibility", authMiddleware, asyncHandler(imageController.toggleVisibility));

imageRoute.delete("/:id", authMiddleware, asyncHandler(imageController.deleteImage));

export default imageRoute;
