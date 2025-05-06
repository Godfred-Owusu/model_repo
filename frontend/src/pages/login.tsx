"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import GsapFadeIn from "@/components/animations/GsapFadeIn";
import { set, useForm } from "react-hook-form";
import { useState } from "react";

import { BounceLoader } from "react-spinners";
import { toast } from "sonner";
import { useRouter } from "next/router";

import { apiService } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth } from "./app/features/isAuthSlice";
import axios from "axios";
import VerificationPrompt from "@/components/verificationPrompt";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function isUserVerified() {
    try {
      const verified: boolean = await apiService.isVerified();
      setIsVerified(verified);
      console.log("Verified:", verified);
      return verified; // return the value
    } catch (error) {
      console.error("Verification check failed:", error);
      return false; // Return false in case of error
    }
  }

  const router = useRouter();
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login({
        email: data.email,
        password: data.password,
      });

      toast.success(response.message);
      dispatch(setIsAuth(true)); // Dispatch the setIsAuth action to set isAuth to true
      reset();
      const verified = await isUserVerified(); // wait for value
      if (verified) {
        router.push("/");
      } else {
        setSuccess(
          "A verification email has been sent to your email address. Please check your inbox (and spam/junk folder) and click the link to verify your account."
        );
      }
    } catch (error: any) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      setError(errorMessage);

      reset();
    } finally {
      setLoading(false);
      // reset();
      // const isAuth = await useSelector((state: any) => state.auth.isAuth);
      // console.log(isAuth);
    }
  };

  return (
    <AuthLayout>
      <GsapFadeIn delay={0.2}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Login to ModelRepo
        </h2>
      </GsapFadeIn>
      <GsapFadeIn delay={0.4}>
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
          Welcome back!
        </p>
      </GsapFadeIn>
      {success ? (
        // <GsapFadeIn delay={0.6}>
        //   <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
        //     <p>{success}</p>
        //     <p className="mt-2">
        //       Didn't receive the email?{" "}
        //       <Link
        //         href="/login"
        //         className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
        //       >
        //         Log in
        //       </Link>
        //     </p>
        //   </div>
        // </GsapFadeIn>
        <VerificationPrompt success={success} />
      ) : (
        <GsapFadeIn delay={0.6}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:ring-2 focus:ring-purple-600 focus:outline-none  bg-gray-100 dark:bg-gray-800`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-full">
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } focus:ring-2 focus:ring-purple-600 focus:outline-none bg-gray-100 dark:bg-gray-800`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white"
            >
              {loading ? <BounceLoader color="#fff" size={20} /> : "Login"}
            </Button>
          </form>
        </GsapFadeIn>
      )}

      <GsapFadeIn delay={0.8}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Sign up
          </Link>
        </p>
      </GsapFadeIn>
    </AuthLayout>
  );
};

export default Login;
