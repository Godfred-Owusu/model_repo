import { isVerified, login, resendVerificationMail, signup } from "./auth";

export const apiService = {
  login,
  signup,
  isVerified,
  resendVerificationMail,
};
