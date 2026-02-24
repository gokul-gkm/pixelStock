import { extractErrorMessage } from "../../utils/apiError.utils";
import { userAxiosInstance, publicAxiosInstance } from "../axios";

export interface ImageItem {
  _id: string;
  title: string;
  imageUrl: string;
  order: number;
  visibility: "public" | "private";
  uploadedAt?: string;
  createdAt?: string;
}

export interface ExploreImage {
  _id: string;
  title: string;
  imageUrl: string;
  createdAt?: string;
}

export interface ExploreResponse {
  success: boolean;
  images: ExploreImage[];
  total: number;
  page: number;
  pages: number;
}

export interface ImagesResponse {
  success: boolean;
  images: ImageItem[];
}

export interface SingleImageResponse {
  success: boolean;
  image: ImageItem;
}

export interface UploadPayload {
  file: File;
  title: string;
}

export const imageService = {

  getImages: async (): Promise<ImagesResponse> => {
    try {
      const res = await userAxiosInstance.get("/images");
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getPublicImages: async (
    page = 1,
    limit = 24,
    search?: string,
  ): Promise<ExploreResponse> => {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search?.trim()) params.search = search.trim();
      const res = await publicAxiosInstance.get("/images/explore", { params });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  uploadImages: async (files: UploadPayload[]): Promise<ImagesResponse> => {
    try {
      const form = new FormData();
      files.forEach(({ file, title }) => {
        form.append("images", file);
        form.append("titles", title);
      });
      const res = await userAxiosInstance.post("/images/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  updateImage: async (
    id: string,
    title: string,
    file?: File,
  ): Promise<SingleImageResponse> => {
    try {
      const form = new FormData();
      form.append("title", title);
      if (file) form.append("image", file);
      const res = await userAxiosInstance.patch(`/images/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  updateImageTitle: async (id: string, title: string): Promise<SingleImageResponse> => {
    try {
      const res = await userAxiosInstance.patch(`/images/${id}/title`, { title });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  toggleVisibility: async (id: string): Promise<SingleImageResponse> => {
    try {
      const res = await userAxiosInstance.patch(`/images/${id}/visibility`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  deleteImage: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await userAxiosInstance.delete(`/images/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  reorderImages: async (
    updates: { id: string; order: number }[],
  ): Promise<{ success: boolean }> => {
    try {
      const res = await userAxiosInstance.patch("/images/reorder", { updates });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
