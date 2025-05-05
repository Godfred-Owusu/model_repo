import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res
          .status(400)
          .json({ message: "Verification token is required" });
      }

      const apiUrl = process.env.API_URL;
      if (!apiUrl) {
        console.error(
          "verify-email error: API_URL environment variable is not defined"
        );
        return res.status(500).json({ message: "Server configuration error" });
      }

      const response = await axios.get(
        `${apiUrl}/users/verify-email?token=${encodeURIComponent(token)}`
      );

      res
        .status(200)
        .json({
          message: response.data.message || "Email verified successfully",
        });
    } catch (error: any) {
      console.error(
        "API verify-email error:",
        error.response?.data || error.message
      );
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        "An error occurred during email verification";
      res.status(statusCode).json({ message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
