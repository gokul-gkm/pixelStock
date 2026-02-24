import { IImage } from "@/models/image.model";

export interface IImageService {
  uploadImages(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
  ): Promise<{ success: boolean; images: IImage[] }>;

  getImages(userId: string): Promise<{ success: boolean; images: IImage[] }>;

  getPublicImages(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ success: boolean; images: IImage[]; total: number; page: number; pages: number }>;

  updateTitle(
    userId: string,
    imageId: string,
    title: string,
  ): Promise<{ success: boolean; image: IImage }>;

  updateImage(
    userId: string,
    imageId: string,
    title?: string,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; image: IImage }>;

  toggleVisibility(
    userId: string,
    imageId: string,
  ): Promise<{ success: boolean; image: IImage }>;

  deleteImage(
    userId: string,
    imageId: string,
  ): Promise<{ success: boolean; message: string }>;

  reorderImages(
    userId: string,
    updates: { id: string; order: number }[],
  ): Promise<{ success: boolean }>;
}
