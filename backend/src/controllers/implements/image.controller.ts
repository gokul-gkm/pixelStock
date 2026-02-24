import Container, { Inject, Service } from "typedi";
import { IImageController } from "../interfaces/image.Icontroller";
import { TOKENS } from "@/di/tokens";
import { IImageService } from "@/services/interfaces/image.Iservice";
import { AuthRequest } from "@/interfaces/api.interface";
import { AppError } from "@/utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import { Response, Request } from "express";

@Service()
export class ImageController implements IImageController {
  constructor(
    @Inject(TOKENS.ImageService)
    private imageService: IImageService,
  ) {}

  uploadImages = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError("No files uploaded", StatusCodes.BAD_REQUEST);
    }
    const rawTitles = req.body.titles;
    const titles: string[] = Array.isArray(rawTitles)
      ? rawTitles
      : rawTitles
        ? [rawTitles]
        : [];

    const response = await this.imageService.uploadImages(userId, files, titles);
    return res.status(StatusCodes.CREATED).json(response);
  };

  getImages = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const response = await this.imageService.getImages(userId);
    return res.status(StatusCodes.OK).json(response);
  };

  getPublicImages = async (req: Request, res: Response): Promise<Response> => {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 24);
    const search = req.query.search as string | undefined;
    const response = await this.imageService.getPublicImages(page, limit, search);
    return res.status(StatusCodes.OK).json(response);
  };

  updateImage = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const id = req.params.id as string;
    const { title } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const response = await this.imageService.updateImage(userId, id, title, file);
    return res.status(StatusCodes.OK).json(response);
  };

  updateTitle = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const id = req.params.id as string;
    const { title } = req.body;
    if (!title?.trim()) throw new AppError("Title is required", StatusCodes.BAD_REQUEST);

    const response = await this.imageService.updateTitle(userId, id, title.trim());
    return res.status(StatusCodes.OK).json(response);
  };

  toggleVisibility = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const id = req.params.id as string;
    const response = await this.imageService.toggleVisibility(userId, id);
    return res.status(StatusCodes.OK).json(response);
  };

  deleteImage = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const id = req.params.id as string;
    const response = await this.imageService.deleteImage(userId, id);
    return res.status(StatusCodes.OK).json(response);
  };

  reorderImages = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const { updates } = req.body as { updates: { id: string; order: number }[] };
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new AppError("updates array is required", StatusCodes.BAD_REQUEST);
    }

    const response = await this.imageService.reorderImages(userId, updates);
    return res.status(StatusCodes.OK).json(response);
  };
}

export const imageController = Container.get(ImageController);
