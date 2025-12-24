// app/login/page.js

"use client";

import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    //Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    //Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Set all errors
    setErrors(newErrors);
    //If no errors → Submit form
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLogin(true);
        await login(formData);
        setFormData({
          email: "",
          password: "",
        });
        setErrors({});
        router.push("/")
      } catch (error) {
      } finally {
        setIsLogin(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login - Nestvested Limited</title>
      </Head>

      {/* Global dark background, centered content */}
      <div className="flex items-center justify-center min-h-screen bg-white p-4 sm:p-8">
        {/* Tablet Mockup Container */}
        <div
          className="w-full max-w-[1000px] bg-[#f5f5f5] rounded-2xl  p-1 overflow-hidden 
          flex flex-col md:flex-row aspect-[16/10] min-h-[500px]
        "
        >
          {/* Left Dark Panel */}
          <div
            className="
            relative flex-1 bg-[url('https://copilot.microsoft.com/th/id/BCO.9af0f91a-ef71-4675-9e54-9e39bdb64caa.png')] bg-cover overflow-hidden 
            flex flex-col justify-end min-w-[40%] rounded-tl-2xl rounded-bl-2xl  hidden md:flex
          "
          >
            {/* Abstract Background Effect (Simulated with gradients) */}



            {/* Footer Branding */}

          </div>

          {/* Right Login Panel */}
          <div
            className="
            flex-1 bg-[white] rounded-tr-2xl rounded-br-2xl p-6 sm:p-10 md:p-20 
            flex flex-col justify-center relative
          "
          >
            <div className="flex justify-center">
              <img src="/images/vydurya-logo.png" alt="Vydurya-logo" className="h-16 w-34 object-contain" />
            </div>

            <p className="mb-8 text-sm text-center">Access your workspace, manage attendance, and track tasks securely.</p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Employee ID
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Employee ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full p-4  rounded-lg border-b bg-[#efefef43]
                    text-base text-gray-800  placeholder:text-gray-500 
                    focus:ring-2 focus:ring-[#00afef5c] focus:outline-none
                  "
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">    
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password:"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full p-4 border-b  rounded-lg bg-[#efefef43]
                    text-base text-gray-800 placeholder:text-gray-500 
                    focus:ring-2 focus:ring-[#00afef5c] focus:outline-none
                  "
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col  pt-4">
                <button
                  disabled={isLogin}
                  type="submit"
                  className="
                    px-8 py-3 bg-[#00aeef] text-white rounded-lg font-semibold text-lg 
                    hover:bg-[#0d1721] transition duration-200
                  "
                >
                  {isLogin ? "Logging In..." : "Login"}
                </button>

              </div>
              
          <footer className="text-xs text-gray-400 text-center mt-10">
            © 2025 Vydurya enterprises. All rights reserved. &nbsp;
          </footer>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;