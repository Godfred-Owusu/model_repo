import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import GsapFadeIn from "@/components/animations/GsapFadeIn";
import { set, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import { BounceLoader } from "react-spinners";

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data: SignupForm | any) => {
    // console.log("Login data", data);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      if (response.status === 201) {
        toast.success(
          "Signup successful! Please check your email to verify your account."
        );
        setSuccess(
          "A verification email has been sent to your email address. Please check your inbox (and spam/junk folder) and click the link to verify your account."
        );
        reset();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      console.error("Signup error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };
  return (
    <AuthLayout>
      <GsapFadeIn delay={0.2}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Create a ModelRepo Account
        </h2>
      </GsapFadeIn>

      <GsapFadeIn delay={0.4}>
        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">
          Join us and store your ML models.
        </p>
      </GsapFadeIn>
      {success ? (
        <GsapFadeIn delay={0.6}>
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
            <p>{success}</p>
            <p className="mt-2">
              Already verified?{" "}
              <Link
                href="/login"
                className="text-purple-700 dark:text-purple-400 font-semibold underline hover:text-purple-800 dark:hover:text-purple-300"
              >
                Log in
              </Link>
            </p>
          </div>
        </GsapFadeIn>
      ) : (
        <GsapFadeIn delay={0.6}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                required
                className="bg-gray-100 dark:bg-gray-800 w-1/2"
                register={register}
                error={errors.firstName?.message?.toString()}
                // label="First Name"
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                className="bg-gray-100 dark:bg-gray-800 w-1/2"
                register={register}
                error={errors.lastName?.message?.toString()}
                // label="Last Name"
              />
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="bg-gray-100 dark:bg-gray-800"
              register={register}
              error={errors.email?.message?.toString()}
              //   label="Email"
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
              {loading ? <BounceLoader color="#fff" size={20} /> : "Sign Up"}
            </Button>
          </form>
        </GsapFadeIn>
      )}
      <GsapFadeIn delay={0.8}>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white font-semibold underline hover:text-gray-200"
          >
            Login
          </Link>
        </p>
      </GsapFadeIn>
    </AuthLayout>
  );
};

export default Signup;
