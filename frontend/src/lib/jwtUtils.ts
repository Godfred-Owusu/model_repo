// import { jwtDecode } from "jwt-decode";

// interface DecodedToken {
//   exp: number;
//   [key: string]: any;
// }

// export const isTokenValid = (token: string): boolean => {
//   try {
//     const decoded: DecodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000; // Current time in seconds
//     return decoded.exp > currentTime; // Check if token is not expired
//   } catch (error) {
//     console.error("Token validation error:", error);
//     return false;
//   }
// };

// // Validate token with NestJS backend
// export const validateTokenWithServer = async (
//   token: string
// ): Promise<boolean> => {
//   try {
//     const response = await fetch(`${process.env.API_URL}/auth/validate`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include", // Include cookies
//     });
//     return response.ok; // Returns true if token is valid
//   } catch (error) {
//     console.error("Server token validation error:", error);
//     return false;
//   }
// };

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime; // Check if token is not expired
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

// Validate token with NestJS backend
export const validateTokenWithServer = async (
  token: string
): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error(
        "validateTokenWithServer error: NEXT_PUBLIC_API_URL environment variable is not defined"
      );
      return false;
    }

    const response = await fetch(`${apiUrl}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Include cookies
    });

    if (!response.ok) {
      console.error(`Server token validation failed: ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Server token validation error:", error);
    return false;
  }
};
