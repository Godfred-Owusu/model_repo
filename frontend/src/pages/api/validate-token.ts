import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const apiUrl = process.env.API_URL;
      if (!apiUrl) {
        console.error(
          "validate-token error: API_URL environment variable is not defined"
        );
        return res.status(500).json({ message: "Server configuration error" });
      }

      // Validate token with NestJS backend
      await axios.get(`${apiUrl}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      res.status(200).json({ message: "Token is valid" });
    } catch (error: any) {
      console.error(
        "Token validation error:",
        error.response?.data || error.message
      );
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
