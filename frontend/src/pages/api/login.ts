// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const { email, password } = req.body;
//       const response = await axios.post(`${process.env.API_URL}/auth/login`, {
//         email,
//         password,
//       });
//       res.status(200).json(response.data);
//     } catch (error) {
//       res.status(500).json({ message: "An error occurred, Login failed" });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }

// pages/api/login.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const { email, password } = req.body;
//       const response = await axios.post(`${process.env.API_URL}/auth/login`, {
//         email,
//         password,
//       });
//       res.status(200).json(response.data);
//     } catch (error: any) {
//       console.error("API login error:", error.response?.data || error.message);

//       const statusCode = error.response?.status || 500;
//       const message =
//         error.response?.data?.message || "An error occurred during login";

//       res.status(statusCode).json({ message });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const response = await axios.post(`${process.env.API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      if (!token) {
        return res
          .status(400)
          .json({ message: "No token received from server" });
      }

      // Set HTTP-only, secure cookie
      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`
      ); // Expires in 1 hour

      res.status(200).json({ message: "Login successful", token }); // Return token for client-side validation
    } catch (error: any) {
      console.error("API login error:", error.response?.data || error.message);
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message || "An error occurred during login";
      res.status(statusCode).json({ message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
