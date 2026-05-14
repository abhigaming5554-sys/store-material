"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    if (!email || !password) {

      alert("Fill all fields");

      return;

    }

    try {

      setLoading(true);

      const res = await fetch(
        "/api/login",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,

            password,

          }),

        }
      );

      const data = await res.json();

      if (data.success) {

        localStorage.setItem(
          "token",
          data.token
        );

        alert("Login Successful 😄");

        router.push("/");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="bg-gray-900 p-10 rounded-3xl w-full max-w-md border border-gray-800">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Welcome Back 😄
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl text-white text-lg font-semibold"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

          <button
            onClick={() =>
              signIn("google")
            }
            className="w-full bg-red-600 hover:bg-red-700 transition py-4 rounded-xl text-white text-lg font-semibold"
          >
            Continue With Google
          </button>

          <a
            href="/forgot-password"
            className="block text-center text-blue-400"
          >
            Forgot Password?
          </a>

          <p className="text-center text-gray-400">

            New user?{" "}

            <a
              href="/signup"
              className="text-blue-400"
            >
              Sign Up
            </a>

          </p>

        </div>

      </div>

    </div>

  );

}