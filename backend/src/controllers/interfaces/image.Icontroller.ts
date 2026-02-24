import { AuthRequest } from "@/interfaces/api.interface";
import { Response, Request } from "express";

export interface IImageController {
  uploadImages(req: AuthRequest, res: Response): Promise<Response>;
  getImages(req: AuthRequest, res: Response): Promise<Response>;
  getPublicImages(req: Request, res: Response): Promise<Response>;
  updateImage(req: AuthRequest, res: Response): Promise<Response>;
  updateTitle(req: AuthRequest, res: Response): Promise<Response>;
  toggleVisibility(req: AuthRequest, res: Response): Promise<Response>;
  deleteImage(req: AuthRequest, res: Response): Promise<Response>;
  reorderImages(req: AuthRequest, res: Response): Promise<Response>;
}
