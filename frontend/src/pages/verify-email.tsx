import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import GsapFadeIn from "@/components/animations/GsapFadeIn";
import Link from "next/link";
import { BounceLoader } from "react-spinners";

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || typeof token !== "string") {
        setError("No verification token provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/verify-email?token=${encodeURIComponent(token)}`
        );

        if (response.status === 200) {
          toast.success("Email verified successfully! Redirecting to login...");
          setSuccess(
            "Your email has been verified. You will be redirected to the login page shortly."
          );
          setTimeout(() => {
            router.push("/login");
          }, 3000); // Redirect after 3 seconds
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to verify email. The token may be invalid or expired.";
        toast.error(errorMessage);
        setError(errorMessage);
        console.error("Verify email error", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  return (
    <AuthLayout>
      <GsapFadeIn delay={0.2}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Verify Your Email
        </h2>
      </GsapFadeIn>
      <GsapFadeIn delay={0.4}>
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
          We are verifying your email address...
        </p>
      </GsapFadeIn>

      {loading ? (
        <GsapFadeIn delay={0.6}>
          <div className="flex justify-center">
            <BounceLoader color="#6b7280" size={40} />
          </div>
        </GsapFadeIn>
      ) : success ? (
        <GsapFadeIn delay={0.6}>
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
            <p>{success}</p>
            <p className="mt-2">
              Click{" "}
              <Link
                href="/login"
                className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
              >
                here
              </Link>{" "}
              to go to the login page now.
            </p>
          </div>
        </GsapFadeIn>
      ) : (
        <GsapFadeIn delay={0.6}>
          <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
            <p>{error}</p>
            <p className="mt-2">
              Try signing up again or contact support if the issue persists.
            </p>
            <p className="mt-2">
              <Link
                href="/signup"
                className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
              >
                Sign up again
              </Link>{" "}
              or{" "}
              <Link
                href="/login"
                className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
              >
                log in
              </Link>
            </p>
          </div>
        </GsapFadeIn>
      )}
    </AuthLayout>
  );
};

export default VerifyEmail;
