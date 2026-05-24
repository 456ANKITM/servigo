import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    console.log("Its Working")
    e.preventDefault();
    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      if (res.success) {
        dispatch(setUser(res.user));
        toast.success("Login successful 🎉");
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        
        {/* Card */}
        <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center">
            Log in to your account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            {/* Email */}
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Enter email or phone"
                className="w-full mt-1 px-4 py-2.5 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-gray-500  outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                className="w-full mt-1 px-4 py-2.5 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-gray-500  outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-600 active:scale-95 transition text-white py-2.5 rounded-lg font-medium shadow-md"
            >
              Log in
            </button>

            {/* Footer */}
            <p className="text-sm text-center text-gray-400">
              Do not have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-400 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signin;