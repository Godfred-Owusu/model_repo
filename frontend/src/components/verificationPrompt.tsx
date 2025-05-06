import React, { useEffect, useState } from "react";
import GsapFadeIn from "./animations/GsapFadeIn";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { BounceLoader } from "react-spinners";

const VerificationPrompt = ({ success }: { success: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.resendVerificationMail();
      toast.success("Verification email sent successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send verification email. Please try again.";
      toast.error("Error sending verification email");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GsapFadeIn delay={0.6}>
      <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
        <p>{success}</p>
        <p className="mt-2">
          Didn't receive the email?{" "}
          <button
            onClick={resend}
            disabled={loading}
            className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
          >
            {loading ? <BounceLoader color="#fff" size={20} /> : "Resend"}
          </button>
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </GsapFadeIn>
  );
};

export default VerificationPrompt;
