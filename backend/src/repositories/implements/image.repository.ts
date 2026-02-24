import { Service } from "typedi";
import { IImage, Image } from "@/models/image.model";
import { IImageRepository } from "../interfaces/image.Irepository";
import { BaseRepository } from "./base.repository";
import { TOKENS } from "@/di/tokens";

@Service({ id: TOKENS.ImageRepository })
export class ImageRepository extends BaseRepository<IImage> implements IImageRepository {
  constructor() {
    super(Image);
  }

  async findByUploader(userId: string): Promise<IImage[]> {
    return await Image.find({ uploaderId: userId }).sort({ order: 1 }).exec();
  }

  async findByIdAndUploader(imageId: string, userId: string): Promise<IImage | null> {
    return await Image.findOne({ _id: imageId, uploaderId: userId }).exec();
  }

  async getMaxOrderForUser(userId: string): Promise<number> {
    const last = await Image.findOne({ uploaderId: userId }).sort({ order: -1 }).exec();
    return last ? (last.order as number) : -1;
  }

  async bulkUpdateOrder(updates: { id: string; order: number }[]): Promise<void> {
    const ops = updates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));
    if (ops.length > 0) {
      await Image.bulkWrite(ops);
    }
  }

  async findPublicImages(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ images: IImage[]; total: number }> {
    const query: Record<string, unknown> = { visibility: "public" };
    if (search?.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }
    const [images, total] = await Promise.all([
      Image.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Image.countDocuments(query),
    ]);
    return { images, total };
  }
}
