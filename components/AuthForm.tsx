"use client";

import { useState } from "react";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit() {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.error || "Something went wrong");
        return;
      }

      if (type === "login") {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setMsg("Signup successful. Please log in.");
      }
    } catch {
      setLoading(false);
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {type === "login"
              ? "Login to your account"
              : "Sign up for a new account"}
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-lg border px-4 py-2.5 pr-11 text-sm focus:ring-2 focus:ring-black"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute inset-y-0 right-3 text-gray-500"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.829M9.88 4.24A9.956 9.956 0 0112 4c5 0 9 4 9 8a7.964 7.964 0 01-1.56 4.58M6.53 6.53A7.962 7.962 0 003 12c0 4 4 8 9 8a9.96 9.96 0 004.24-.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.065 7-9.542 7
                       -4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium
                     hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Processing..." : type === "login" ? "Login" : "Signup"}
        </button>
        {/* Switch Auth */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {type === "login" ? (
            <>
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-black hover:underline"
              >
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-black hover:underline"
              >
                Login
              </a>
            </>
          )}
        </p>

        {/* Message */}
        {msg && (
          <p
            className={`mt-4 text-sm text-center ${
              msg.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
