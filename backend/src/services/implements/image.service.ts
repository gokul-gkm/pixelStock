import { Inject, Service } from "typedi";
import { IImageService } from "../interfaces/image.Iservice";
import { TOKENS } from "@/di/tokens";
import { IImageRepository } from "@/repositories/interfaces/image.Irepository";
import { IImage } from "@/models/image.model";
import { AppError } from "@/utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import cloudinary from "@/config/cloudinary.config";

@Service({ id: TOKENS.ImageService })
export class ImageService implements IImageService {
  constructor(
    @Inject(TOKENS.ImageRepository)
    private _imageRepository: IImageRepository,
  ) {}

  private handleError(message: string, error: unknown): never {
    console.error(message, error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong. Please try again later.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  private uploadToCloudinary(
    buffer: Buffer,
    folder: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(buffer);
    });
  }

  private extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith("v") ? afterUpload.slice(1) : afterUpload;
    return withoutVersion.join("/").replace(/\.[^.]+$/, "");
  }

  async uploadImages(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
  ): Promise<{ success: boolean; images: IImage[] }> {
    try {
      const maxOrder = await this._imageRepository.getMaxOrderForUser(userId);
      const uploaded: IImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = titles[i] ?? file.originalname.replace(/\.[^.]+$/, "");

        const { url } = await this.uploadToCloudinary(file.buffer, `pixelstock/${userId}`);

        const image = await this._imageRepository.create({
          uploaderId: userId,
          title,
          imageUrl: url,
          order: maxOrder + 1 + i,
          visibility: "private",
        } as any);

        uploaded.push(image);
      }

      return { success: true, images: uploaded };
    } catch (error) {
      this.handleError("Upload Images Error:", error);
    }
  }

  async getImages(userId: string): Promise<{ success: boolean; images: IImage[] }> {
    try {
      const images = await this._imageRepository.findByUploader(userId);
      return { success: true, images };
    } catch (error) {
      this.handleError("Get Images Error:", error);
    }
  }

  async getPublicImages(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ success: boolean; images: IImage[]; total: number; page: number; pages: number }> {
    try {
      const { images, total } = await this._imageRepository.findPublicImages(page, limit, search);
      return { success: true, images, total, page, pages: Math.ceil(total / limit) };
    } catch (error) {
      this.handleError("Get Public Images Error:", error);
    }
  }

  async updateTitle(
    userId: string,
    imageId: string,
    title: string,
  ): Promise<{ success: boolean; image: IImage }> {
    try {
      const existing = await this._imageRepository.findByIdAndUploader(imageId, userId);
      if (!existing) throw new AppError("Image not found", StatusCodes.NOT_FOUND);

      const updated = await this._imageRepository.update(imageId, { title } as any);
      if (!updated) throw new AppError("Failed to update image", StatusCodes.BAD_REQUEST);

      return { success: true, image: updated };
    } catch (error) {
      this.handleError("Update Title Error:", error);
    }
  }

  async updateImage(
    userId: string,
    imageId: string,
    title?: string,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; image: IImage }> {
    try {
      const existing = await this._imageRepository.findByIdAndUploader(imageId, userId);
      if (!existing) throw new AppError("Image not found", StatusCodes.NOT_FOUND);

      const changes: Record<string, unknown> = {};
      if (title?.trim()) changes.title = title.trim();

      if (file) {
        const { url } = await this.uploadToCloudinary(file.buffer, `pixelstock/${userId}`);
        try {
          const oldPublicId = this.extractPublicId(existing.imageUrl as string);
          await cloudinary.uploader.destroy(oldPublicId);
        } catch(err) {
          console.log("Update Image error: ",err)
         }
        changes.imageUrl = url;
      }

      if (Object.keys(changes).length === 0) {
        return { success: true, image: existing };
      }

      const updated = await this._imageRepository.update(imageId, changes as any);
      if (!updated) throw new AppError("Failed to update image", StatusCodes.BAD_REQUEST);

      return { success: true, image: updated };
    } catch (error) {
      this.handleError("Update Image Error:", error);
    }
  }

  async toggleVisibility(
    userId: string,
    imageId: string,
  ): Promise<{ success: boolean; image: IImage }> {
    try {
      const existing = await this._imageRepository.findByIdAndUploader(imageId, userId);
      if (!existing) throw new AppError("Image not found", StatusCodes.NOT_FOUND);

      const newVisibility = existing.visibility === "public" ? "private" : "public";
      const updated = await this._imageRepository.update(imageId, {
        visibility: newVisibility,
      } as any);
      if (!updated) throw new AppError("Failed to update visibility", StatusCodes.BAD_REQUEST);

      return { success: true, image: updated };
    } catch (error) {
      this.handleError("Toggle Visibility Error:", error);
    }
  }

  async deleteImage(
    userId: string,
    imageId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existing = await this._imageRepository.findByIdAndUploader(imageId, userId);
      if (!existing) throw new AppError("Image not found", StatusCodes.NOT_FOUND);

      const publicId = this.extractPublicId(existing.imageUrl as string);
      await cloudinary.uploader.destroy(publicId);

      await this._imageRepository.delete(imageId);
      return { success: true, message: "Image deleted successfully" };
    } catch (error) {
      this.handleError("Delete Image Error:", error);
    }
  }

  async reorderImages(
    userId: string,
    updates: { id: string; order: number }[],
  ): Promise<{ success: boolean }> {
    try {
      for (const { id } of updates) {
        const img = await this._imageRepository.findByIdAndUploader(id, userId);
        if (!img) throw new AppError(`Image ${id} not found`, StatusCodes.NOT_FOUND);
      }
      await this._imageRepository.bulkUpdateOrder(updates);
      return { success: true };
    } catch (error) {
      this.handleError("Reorder Images Error:", error);
    }
  }
}
