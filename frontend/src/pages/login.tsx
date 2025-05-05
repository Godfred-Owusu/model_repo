import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import GsapFadeIn from "@/components/animations/GsapFadeIn";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { isTokenValid, validateTokenWithServer } from "@/lib/jwtUtils";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const router = useRouter();
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    // console.log("Login data", data);
    try {
      const response = await axios.post("/api/login", {
        email: data.email,
        password: data.password,
      });
      // console.log("Login response", response.data);
      if (response.status === 200 && response.data.token) {
        console.log(response.data.token);
        if (!isTokenValid(response.data.token)) {
          toast.error("Token is invalid or expired. Please try again.");
          return;
        }

        const isValid = await validateTokenWithServer(response.data.token);
        if (isValid) {
          toast.success("Login successful");
          router.push("/");
          return;
        } else {
          toast.error("Token is invalid or expired. Please try again.");
        }
      } else {
        toast.error("No token received. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      // setLoading(false);
      console.error("Login error", error);
    } finally {
      setLoading(false);
      reset();
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

      <GsapFadeIn delay={0.6}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            register={register}
            error={errors.email?.message?.toString()}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="bg-gray-100 dark:bg-gray-800"
            register={register}
            error={errors.password?.message?.toString()}
            //   label="Password"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white"
          >
            {loading ? <BounceLoader color="#fff" size={20} /> : "Login"}
          </Button>
        </form>
      </GsapFadeIn>

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
