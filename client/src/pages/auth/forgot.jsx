import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );

      toast.success(
        res.data.message ||
          "Reset link sent successfully!"
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to send password reset link."
      );
    } finally {
      setLoading(false);
      navigate("/auth/login");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold text-center px-8 mb-4">
          Welcome to Forever Shopping Site
        </h1>
        <p className="text-gray-300 text-center max-w-sm">
          Shop the latest trends with ease and security.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Forgot your password?
          </h2>
          <p className="text-center text-gray-900 mb-6">
            Enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-black-900"
              >
                Email Address
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white text-base font-medium ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
