import { IImage } from "@/models/image.model";
import { IBaseRepository } from "./base.Irepository";

export interface IImageRepository extends IBaseRepository<IImage> {
  findByUploader(userId: string): Promise<IImage[]>;
  findByIdAndUploader(imageId: string, userId: string): Promise<IImage | null>;
  getMaxOrderForUser(userId: string): Promise<number>;
  bulkUpdateOrder(updates: { id: string; order: number }[]): Promise<void>;
  findPublicImages(page: number, limit: number, search?: string): Promise<{ images: IImage[]; total: number }>;
}
