import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAppliedWorkerRankedQuery,
  useGetJobByIdQuery,
  useHireWorkerMutation,
} from "../redux/api/api";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MapPin } from "lucide-react";
import SplashScreen from "./SplashScreen";

dayjs.extend(relativeTime);

const AppliedWorkers = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetJobByIdQuery(jobId);
  const { data: appliedWorkers, isLoading: loadingAppliedWorkers } =
    useGetAppliedWorkerRankedQuery(jobId);
  const [hireWorker, { isLoading: hiring }] = useHireWorkerMutation();

  const job = data?.job;
  const jobAlreadyHasWorker = !!job?.hiredWorker;
  console.log(appliedWorkers)

  if (isLoading) return <SplashScreen />
  if (error) return <Error />
    

  const handleHire = async (userId) => {
    console.log("Yes its commiingg here ")
    try {
      const res = await hireWorker({ jobId, userId }).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to hire the worker");
    }
  };

  const formatDistance = (distance) => {
  if (distance == null) return null;

  // if less than 1 km → show meters
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  // otherwise km
  return `${distance.toFixed(1)} km away`;
};

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="min-h-screen px-4 md:px-10 py-10">

        {/* JOB CARD */}
        <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
            <h1 className="text-3xl font-bold">{job.title}</h1>

            <span
              className={`px-4 py-1 rounded-full text-sm border ${
                job.status === "Completed"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : job.status === "Accepted"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/30"
              }`}
            >
              {job.status}
            </span>
          </div>

          <p className="mt-4 text-zinc-400 leading-relaxed">
            {job.description}
          </p>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {/* LEFT */}
            <div className="space-y-4">
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400">Budget</p>
                <h2 className="font-medium">
                  ₹ {job.budget?.amount} / {job.budget?.type}
                </h2>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400">Category</p>
                <h2 className="font-medium">{job.category}</h2>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400">Location</p>
                <h2 className="font-medium">{job.location}</h2>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400">Client</p>
                <h2 className="font-medium">{job.client?.name}</h2>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400 mb-2">
                  Skills Required
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-700 border border-zinc-600 text-zinc-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                <p className="text-sm text-zinc-400">Posted On</p>
                <h2 className="font-medium">
                  {dayjs(job.createdAt).fromNow()}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* APPLIED WORKERS */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            Applied Workers - Ranked Matches
          </h2>

          {loadingAppliedWorkers ? (
            <p className="text-zinc-400">Loading workers...</p>
          ) : appliedWorkers?.workers?.length === 0 ? (
            <p className="text-zinc-500">No workers applied yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {appliedWorkers.workers.map((worker, index) => {
                const isAlreadyHired =
                  job?.hiredWorker &&
                  job.hiredWorker.toString() === worker._id.toString();

                return (
                  <div
                    key={worker._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition"
                  >
                    {/* TOP BADGE */}
                    {index === 0 && (
                      <span className="inline-block mb-2 px-3 py-1 text-xs bg-green-500/10 text-green-400 border border-green-500/30 rounded-full">
                        ⭐ Top Match
                      </span>
                    )}

                    {worker.distance != null && (
  <div className="flex justify-start mb-2">
    <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
      <MapPin size={12} />
      {formatDistance(worker.distance)}
    </span>
  </div>
)}

                    {/* HEADER */}
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          worker.profileImage ||
                          "https://via.placeholder.com/60"
                        }
                        className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                          {worker.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {worker.professionalTitle || "Freelancer"}
                        </p>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="mt-3 text-sm text-zinc-400">
                      ⭐ {worker.ratingsAverage?.toFixed(1) || "0.0"} (
                      {worker.totalReviews || 0} reviews)
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
                      <MapPin size={14} />
                      {worker.city}
                    </div>

                    {/* SKILLS */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {worker.skills?.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleHire(worker._id)}
                        disabled={isAlreadyHired || jobAlreadyHasWorker || hiring}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${
                          isAlreadyHired
                            ? "bg-green-500/10 text-green-400 border border-green-500/30 cursor-not-allowed"
                            : jobAlreadyHasWorker
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-200"
                        }`}
                      >
                        {isAlreadyHired
                          ? "Hired"
                          : jobAlreadyHasWorker
                          ? "Filled"
                          : hiring
                          ? "Hiring..."
                          : "Hire"}
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/public/worker-profile/${worker._id}`
                          )
                        }
                        className="flex-1 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppliedWorkers;