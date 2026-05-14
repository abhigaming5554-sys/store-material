"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  // Send OTP
  const sendOtp =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            "/api/send-reset-otp",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                email,

              }),

            }
          );

        const data =
          await res.json();

        alert(data.message);

        if (data.success) {

          setStep(2);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // Reset Password
  const resetPassword =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            "/api/reset-password",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                email,

                otp,

                password,

              }),

            }
          );

        const data =
          await res.json();

        alert(data.message);

        if (data.success) {

          window.location.href =
            "/login";

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">

        <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>

        <div className="absolute w-[400px] h-[400px] bg-purple-500 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

        <h1 className="text-4xl font-bold text-center mb-8">

          Forgot Password 🔐

        </h1>

        {/* Step 1 */}
        {step === 1 && (

          <>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none mb-5"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl text-lg font-semibold"
            >

              {loading
                ? "Sending..."
                : "Send OTP"}

            </button>

          </>

        )}

        {/* Step 2 */}
        {step === 2 && (

          <>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none mb-5"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none mb-5"
            />

            <button
              onClick={
                resetPassword
              }
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition py-4 rounded-xl text-lg font-semibold"
            >

              {loading
                ? "Resetting..."
                : "Reset Password"}

            </button>

          </>

        )}

      </div>

    </div>

  );

}