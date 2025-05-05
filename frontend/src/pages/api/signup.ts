import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { firstName, lastName, email, password } = req.body;
      const apiUrl = process.env.API_URL;
      if (!apiUrl) {
        console.error(
          "signup error: API_URL environment variable is not defined"
        );
        return res.status(500).json({ message: "Server configuration error" });
      }

      const response = await axios.post(`${apiUrl}/users`, {
        firstName,
        lastName,
        email,
        password,
      });

      res.status(201).json({ message: "Signup successful" });
    } catch (error: any) {
      console.error("API signup error:", error.response?.data || error.message);
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message || "An error occurred during signup";
      res.status(statusCode).json({ message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
