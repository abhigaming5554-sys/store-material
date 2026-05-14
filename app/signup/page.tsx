"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async () => {

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {

      alert("Fill all fields");

      return;

    }

    if (phone.length < 10) {

      alert(
        "Enter valid phone number"
      );

      return;

    }

    if (password.length < 6) {

      alert(
        "Password minimum 6 characters"
      );

      return;

    }

    try {

      setLoading(true);

      const res = await fetch(
        "/api/signup",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name,

            email,

            phone,

            password,

          }),

        }
      );

      const data = await res.json();

      if (data.success) {

        alert("Signup Successful 😄");

        router.push("/login");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Signup Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="bg-gray-900 p-10 rounded-3xl w-full max-w-md border border-gray-800">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Create Account 🚀
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white outline-none"
          />

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
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
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
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl text-white text-lg font-semibold"
          >

            {loading
              ? "Creating..."
              : "Sign Up"}

          </button>

          <p className="text-center text-gray-400">

            Already have account?{" "}

            <a
              href="/login"
              className="text-blue-400"
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>

  );

}