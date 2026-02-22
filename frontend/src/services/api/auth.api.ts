import type { SignupSchemaType } from "../../lib/validations/auth.z.validation";
import { publicAxiosInstance } from "../axios";

function extractErrorMessage(error: any): string {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export const authService = {
  signup: async(data: SignupSchemaType) => {
    try {
      const res = await publicAxiosInstance.post("/auth/sign-up", data);
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
