import api from "@/lib/axios";
import { Ilogin } from "@/types/login";
import { Isignup } from "@/types/signup";
import axios from "axios";

export const login = async (data: Ilogin): Promise<any> => {
  try {
    const response = await api.post("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const signup = async (data: Isignup): Promise<any> => {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const isVerified = async (): Promise<boolean> => {
  try {
    const response = await api.get("/auth/is-user-verified", {
      withCredentials: true,
    });
    return response.data.status;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extract message from backend response
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const resendVerificationMail = async () => {
  try {
    const response = await api.get("/auth/get-email", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Extract message from backend response
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
