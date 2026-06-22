"use client";
import React, { use, useState } from "react";
import {
  Form,
  Button,
  TextField,
  Label,
  Input,
  Description,
  FieldError,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = ({ searchParams }) => {
  const { callbackURL } = use(searchParams);
  const destination =
    typeof callbackURL === "string" &&
    callbackURL.startsWith("/") &&
    !callbackURL.startsWith("//")
      ? callbackURL
      : "/";
  const Router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    let newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(`Login Failed  ${error.message}`);
        setErrors({ email: "Invalid email or password." });
      } else {
        toast.success("Login Successful!", {
          onClose: () => Router.push(destination),
        });
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <Form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border dark:border-gray-800"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Login
        </h1>

        <TextField name="email" className="mb-4" isInvalid={!!errors.email}>
          <Label>Email</Label>
          <Input type="email" placeholder="Enter your email" />
          <Description>Use the email you registered with.</Description>
          <FieldError>{errors.email}</FieldError>
        </TextField>

        <div className="relative mb-6">
          <TextField name="password" isInvalid={!!errors.password}>
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <Description>Minimum 6 characters.</Description>
            <FieldError>{errors.password}</FieldError>
          </TextField>
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-red-600 text-white font-bold py-3"
        >
          Login
        </Button>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Do not have an account?{" "}
          <Link
            href="/auth/register"
            className="text-red-600 font-bold underline"
          >
            Register here
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
