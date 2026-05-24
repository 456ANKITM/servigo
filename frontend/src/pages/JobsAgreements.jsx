import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  useCreateConversationMutation,
  useGetUserAgreementsQuery,
  useMarkJobCompletedMutation,
} from "../redux/api/api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const JobsAgreements = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, error, refetch } = useGetUserAgreementsQuery();
  const [markJobCompleted] = useMarkJobCompletedMutation();
  
      const [createConversation] = useCreateConversationMutation();

  const agreements = data?.agreements || [];

  if (isLoading)
    return <SplashScreen />

  if (error) return <ErrorPage />

  const jobCompletion = async (jobId) => {
    try {
      const res = await markJobCompleted(jobId).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch();
      } else toast.error(res.message);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark completed");
    }
  };

   const handleMessageUser = async (userId) => {
      if (!user?._id) {
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

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="px-4 md:px-10 py-10 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Agreements</h1>

          {agreements.length === 0 ? (
            <p className="text-zinc-500">No agreements found</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {agreements.map((agreement) => {
                const job = agreement.jobId;
                const client = agreement.clientId;
                const worker = agreement.workerId;

                return (
                  <div
                    key={agreement._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
                  >
                    {/* STATUS BADGE */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {job.status === "completed"
                          ? "Agreemnt Closed"
                          : "Agreement Active"}
                      </span>

                      <span className="text-xs text-zinc-500">
                        {dayjs(job.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>

                    {/* JOB TITLE */}
                    <h2 className="text-xl font-semibold mt-4">{job.title}</h2>

                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                      {job.description}
                    </p>

                    {/* BUDGET + CATEGORY */}
                    <div className="flex justify-between mt-4 text-sm">
                      <span className="text-zinc-400">
                        💰 ₹ {job.budget?.amount} / {job.budget?.type}
                      </span>

                      <span className="text-zinc-400">{job.category}</span>
                    </div>

                    {/* LOCATION */}
                    <div className="mt-2 text-sm text-zinc-500">
                      📍 {job.location}
                    </div>

                    {/* CLIENT + WORKER */}
                    <div className="mt-6 flex justify-between items-center">
                      {/* CLIENT */}
                      <div className="flex items-center gap-3">
                        <img
                          src={client?.profileImage}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <p className="text-xs text-zinc-400">Client</p>
                          <h3 className="text-sm font-medium">
                            {client?.name}
                          </h3>
                        </div>

                        {user.role === "worker" && (
                          <button
                            onClick={() => handleMessageUser(client._id)}
                            className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} /> Message
                            </div>
                          </button>
                        )}
                      </div>

                      {/* WORKER */}
                      <div className="flex items-center gap-3">
                        <img
                          onClick={() =>
                            navigate(`/public/worker-profile/${worker._id}`)
                          }
                          src={worker?.profileImage}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700 cursor-pointer"
                        />
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">Worker</p>
                          <h3 className="text-sm font-medium">
                            {worker?.name}
                          </h3>
                        </div>
                           {user.role === "client" && (
                          <button
                            onClick={() => handleMessageUser(worker._id)}
                            className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} /> Message
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="mt-6 flex justify-between items-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${
                          job.status === "completed"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : job.status === "in-progress"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {job.status}
                      </span>

                      {user.role === "client" && 
                      <div> 

                         <button 
                      className="text-sm text-white border border-zinc-700 px-4 py-1 rounded-lg hover:bg-zinc-800 transition"
                      onClick={()=>navigate(`/public/worker-profile/${worker._id}`)}>Rate and Review the Worker
                      </button> 

                               <button
                        onClick={() => jobCompletion(job._id)}
                        className="text-sm text-white border border-zinc-700 px-4 py-1 rounded-lg hover:bg-zinc-800 transition"
                      >
                        {job.status === "completed"
                          ? "Completed"
                          : "Mark Job Completed"}
                      </button>
                      </div>
                      
                      }
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

export default JobsAgreements;
