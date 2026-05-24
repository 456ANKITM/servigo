import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  useBrowseJobsQuery,
  useCreateConversationMutation,
  useEasyApplyJobMutation,
} from "../redux/api/api";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const BrowseJobs = () => {
  const { data, isLoading, error, refetch } = useBrowseJobsQuery();
  const [easyApplyJob, { isLoading: LoadingApply }] =
    useEasyApplyJobMutation();
  const [createConversation] = useCreateConversationMutation();

  const jobs = data?.jobs || [];
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const handleEasyApply = async (jobId) => {
    try {
      const res = await easyApplyJob(jobId).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch()
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to apply");
    }
  };

  const handleMessageUser = async (userId) => {
    if (!currentUser?._id) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await createConversation({
        receiverId: userId,
      }).unwrap();

      if (res.success) {
        navigate(`/chat?conversationId=${res.conversation._id}`);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to Start the conversation"
      );
    }
  };

  const formatDistance = (distance) => {
    if (distance == null) return null;

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }

    return `${distance.toFixed(1)} km away`;
  };

  if (isLoading) return <SplashScreen />;

 if (error) return <ErrorPage />;
 
  return (
    <div className="bg-zinc-950 min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Browse Jobs
          </h1>
          <p className="text-zinc-400 mt-2">
            Find jobs that match your skills and location
          </p>
        </div>

        {/* JOB GRID */}
        {jobs.length === 0 ? (
          <p className="text-zinc-500">No jobs available</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              // ✅ FIX: check per job
              const isApplied = job?.appliedWorkers?.some(
                (id) =>
                  id?.toString() === currentUser?._id?.toString()
              );

              return (
                <div
                  key={job._id}
                  className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* DISTANCE */}
                  {job.distance != null && (
                    <div className="flex justify-start mb-2">
                      <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                        <MapPin size={12} />
                        {formatDistance(job.distance)}
                      </span>
                    </div>
                  )}

                  {/* TITLE */}
                  <h2 className="text-xl font-semibold mt-6">
                    {job.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-zinc-400 text-sm mt-2 line-clamp-3">
                    {job.description}
                  </p>

                  {/* META */}
                  <div className="mt-4 space-y-2 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Briefcase size={14} />
                      {job.category}
                    </div>

                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} />
                      {job.budget?.amount} / {job.budget?.type}
                    </div>
                  </div>

                  {/* SKILLS */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills?.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CLIENT */}
                  <div className="flex justify-between mt-5">
                    <div className="flex items-center gap-6">
                      <img
                        src={
                          job.client?.profileImage ||
                          "https://via.placeholder.com/40"
                        }
                        className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {job.client?.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {job.client?.city}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleMessageUser(job.client?._id)
                      }
                      className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} /> Message
                      </div>
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/jobdetails/${job._id}`)
                      }
                      className="flex-1 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEasyApply(job._id)}
                      disabled={isApplied || LoadingApply}
                      className={`flex-1 rounded-lg transition ${
                        isApplied
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "border border-zinc-700 hover:bg-zinc-800"
                      }`}
                    >
                      {isApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowseJobs;