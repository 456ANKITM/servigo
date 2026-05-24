import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useGetJobsByClientQuery, useMarkJobCompletedMutation } from "../redux/api/api";
import { Briefcase, Users, CheckCircle, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const JobsPosted = () => {
  const { data, isLoading, error, refetch } = useGetJobsByClientQuery();
   const [markJobCompleted] = useMarkJobCompletedMutation();
  const navigate = useNavigate();

  const jobs = data?.jobs || [];

    const jobCompletion = async (jobId) => {
      try {
        const res = await markJobCompleted(jobId).unwrap();
        if (res.success) {
          toast.success(res.message);
          refetch();
        } else toast.error(res.message);
      } catch (error) {
        toast.error( error?.data?.message || "Failed to mark completed");
      }
    };

  if (isLoading) return <SplashScreen />
  if (error) return <ErrorPage />

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="px-4 md:px-10 lg:px-20 py-10">
        <h1 className="text-2xl font-semibold mb-6">Your Posted Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-400">No jobs posted yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobdetails/${job._id}`)}
                className="relative bg-zinc-900 border border-white/10 rounded-xl p-5 shadow-lg cursor-pointer hover:scale-[1.02] transition"
              >
                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full 
                  ${
                    job.status === "completed"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {job.status === "completed" ? "Closed" : "Open"}
                </span>

                {/* TITLE */}
                <h2 className="text-lg font-semibold mb-2">
                  {job.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {job.description}
                </p>

                {/* DETAILS */}
                <div className="text-sm text-gray-400 mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} /> {job.location}
                    </div>
                   
                  <p>NPR {job.budget?.amount} ({job.budget?.type})</p>
                  <p>Skills:  {job.skills?.join(", ")}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div
                  className="flex gap-3 mt-4"
                  onClick={(e) => e.stopPropagation()} // prevent card click
                >
                  {/* APPLIED WORKERS */}
                  <button
                    onClick={() =>
                      navigate(`/job/${job._id}/workers`)
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                  >
                    <Users size={16} />
                    Applied Users
                  </button>

                  {/* MARK COMPLETED */}
                  {job.status !== "completed" && (
                    <button
                     onClick={() => jobCompletion(job._id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-500 rounded-lg"
                    >
                      <CheckCircle size={16} />
                         {job.status === "completed"
                          ? "Completed"
                          : "Mark Done"}
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default JobsPosted;