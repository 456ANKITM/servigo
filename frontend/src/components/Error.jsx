import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const ErrorPage = ({ message = "Something went wrong" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-4">
      
      {/* ICON */}
      <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-full mb-6">
        <AlertTriangle className="text-red-400" size={40} />
      </div>

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Oops! Something went wrong
      </h1>

      {/* MESSAGE */}
      <p className="text-zinc-400 text-sm sm:text-base text-center max-w-md mb-6">
        {message}
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition text-sm"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition text-sm font-medium"
        >
          <Home size={16} />
          Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;