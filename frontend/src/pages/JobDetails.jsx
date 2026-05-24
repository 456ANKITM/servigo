// import React, { useState } from "react";
// import {
//   useCreateConversationMutation,
//   useEasyApplyJobMutation,
//   useGetJobByIdQuery,
//   useGetSavedJobsQuery,
//   useSaveJobMutation,
//   useSubmitProposalMutation,
// } from "../redux/api/api";
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import toast from "react-hot-toast";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { MessageCircle, MessageSquare } from "lucide-react";
// import { useSelector } from "react-redux";
// import { current } from "@reduxjs/toolkit";

// dayjs.extend(relativeTime);

// const JobDetails = () => {
 
//   const navigate = useNavigate();
//   const { jobId } = useParams();
//   const [formData, setFormData] = useState({
//     bidAmount: "",
//     deliveryTime: "",
//     coverLetter: "",
//   });
//   const currentUser = useSelector((state) => state.auth.user);
  

//     const [createConversation] =
//       useCreateConversationMutation();

//   const { data, isLoading, error } = useGetJobByIdQuery(jobId);
//   const [submitProposal] = useSubmitProposalMutation();
//   const [easyApplyJob, { isLoading: LoadingApply }] = useEasyApplyJobMutation();
//   const [saveJob] = useSaveJobMutation();
//   const { data: savedJobsData, refetch: refetchSavedJobs } =
//     useGetSavedJobsQuery();

//   const savedJobs = savedJobsData?.jobs || [];

//   const isSaved = savedJobs.some((j) => j._id === jobId);

//   const job = data?.job;
//   const userId = job?.client?._id;

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching job</p>;


//   const handleEasyApply = async (e) => {
//     e.preventDefault();
//     try {
//       let res = await easyApplyJob(jobId).unwrap();
//       if (res.success) {
//         toast.success(res.message);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error(error);
//     }
//   };

//   const handleSaveJob = async () => {
//     try {
//       const res = await saveJob(jobId).unwrap();
//       if (res.success) {
//         toast.success(res.message);
//         refetchSavedJobs();
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to Save the job");
//     }
//   };

//     const handleMessageUser = async () => {
//       if (!currentUser?._id) {
//         toast.error("Please login first");
//         return;
//       }
  
//       try {
//         const res = await createConversation({
//           receiverId: userId,
//         }).unwrap();
  
//         if (res.success) {
//           navigate(
//             `/chat?conversationId=${res.conversation._id}`
//           );
//         }
//       } catch (error) {
//         toast.error(
//           error?.data?.message ||
//             "Failed to Start the conversation"
//         );
//       }
//     };
  

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen bg-gray-50 p-4 md:p-10 ">
//         <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
//           {/* Title + Status  */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>

//             <span
//               className={`px-4 py-1 rounded-full text-sm font-semibold
//       ${
//         job.status === "open"
//           ? "bg-blue-100 text-blue-600"
//           : job.status === "in-progress"
//             ? "bg-yellow-100 text-yellow-600"
//             : job.status === "completed"
//               ? "bg-green-100 text-green-600"
//               : "bg-gray-100 text-gray-600"
//       }
//     `}
//             >
//               {job.status}
//             </span>
//           </div>

//           <p className="mt-4 text-gray-600 leading-relaxed">
//             {job.description}
//           </p>

//           {/* InfoGrid  */}
//           <div className="grid md:grid-cols-2 gap-6 mt-6">
//             {/* Left Side  */}
//             <div className="space-y-4">
//               {/* Budget  */}
//               <div className="bg-gray-100 p-4 rounded-xl">
//                 <p className="text-sm text-gray-500">Budget</p>

//                 {job.budget?.type === "negotiable" ? (
//                   <h2 className="font-medium text-indigo-600">Negotiable</h2>
//                 ) : (
//                   <h2 className="font-medium">
//                     ₹ {job.budget?.amount}{" "}
//                     <span className="text-gray-500 text-sm">
//                       / {job.budget?.type}
//                     </span>
//                   </h2>
//                 )}
//               </div>

//               {/* Category  */}
//               <div className="bg-gray-100 p-4 rounded-xl">
//                 <p className="text-sm text-gray-500">Category</p>
//                 <h2 className="font-medium">{job.category}</h2>
//               </div>

//               {/* Location  */}
//               <div className="bg-gray-100 p-4 rounded-xl">
//                 <p className="text-sm text-gray-500">Location</p>
//                 <h2 className="font-medium">{job.location}</h2>
//               </div>
//             </div>

//             {/* Right Side  */}
//             <div className="space-y-4">
//               {/* Client  */}
//               <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Client</p>
//                   <div className="flex gap-3 items-center ">
//                      <h2 className="font-medium">{job.client?.name}</h2>
//                      <MessageSquare onClick={handleMessageUser}  size={18} className="" />
//                   </div>
                  
//                 </div>

//                 {job.client?.isVerified && (
//                   <span className="text-blue-500 text-sm font-medium">
//                     Verified
//                   </span>
//                 )}
//               </div>

//               {/* Skills  */}
//               <div className="bg-gray-100 p-4 rounded-xl">
//                 <p className="text-sm text-gray-500 mb-2">Skills Required</p>

//                 <div className="flex flex-wrap gap-2">
//                   {job.skills?.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Dates  */}
//               <div className="bg-gray-100 p-4 rounded-xl">
//                 <p className="text-sm text-gray-500">Posted</p>
//                 <h2 className="font-medium">
//                   {dayjs(job.createdAt).fromNow()}
//                 </h2>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col md:flex-row gap-4">
//             <button
//               disabled={LoadingApply}
//               onClick={handleEasyApply}
//               className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50 "
//             >
//               {LoadingApply ? "Applying" : "Easy Apply"}
//             </button>
//             <button
//               onClick={handleSaveJob}
//               disabled={isSaved}
//               className={`border px-6 rounded-lg transition ${isSaved ? "bg-green-100 border-green-400" : "border-gray-300 hover:bg-gray-100"}`}
//             >
//               {isSaved ? "Saved" : "Save job"}
//             </button>
//           </div>
//         </div>
//       </div>

    
//       <Footer />
//     </div>
//   );
// };

// export default JobDetails;

import React, { useEffect, useState } from "react";
import {
  useCreateConversationMutation,
  useEasyApplyJobMutation,
  useGetJobByIdQuery,
  useGetSavedJobsQuery,
  useSaveJobMutation,
} from "../redux/api/api";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

dayjs.extend(relativeTime);

const JobDetails = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [formData] = useState({
    bidAmount: "",
    deliveryTime: "",
    coverLetter: "",
  });

  const currentUser = useSelector((state) => state.auth.user);

  const [createConversation] = useCreateConversationMutation();

  const { data, isLoading, error, refetch } = useGetJobByIdQuery(jobId);
  const [easyApplyJob, { isLoading: LoadingApply }] =
    useEasyApplyJobMutation();
  const [saveJob] = useSaveJobMutation();
  const { data: savedJobsData, refetch: refetchSavedJobs } =
    useGetSavedJobsQuery();

  const savedJobs = savedJobsData?.jobs || [];
  const job = data?.job;
  console.log(job?.appliedWorkers)
  console.log(currentUser)
  
  const userId = job?.client?._id;

  const isSaved = savedJobs.some((j) => j._id === jobId);
  const allreadyApplied =
  job?.appliedWorkers?.some(
    (id) => id.toString() === currentUser?._id?.toString()
  );
 

  if (isLoading) return <SplashScreen />
  if (error) return <ErrorPage />


  const handleEasyApply = async (e) => {
    e.preventDefault();
    try {
      const res = await easyApplyJob(jobId).unwrap();
      if (res.success) {
         toast.success(res.message);
          refetch();
      } 
     
      else toast.error(res.message);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSaveJob = async () => {
    try {
      const res = await saveJob(jobId).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetchSavedJobs();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to Save the job");
    }
  };

  const handleMessageUser = async () => {
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



  

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="min-h-screen px-4 md:px-10 py-10">
        {/* MAIN CARD */}
        <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
            <h1 className="text-3xl font-bold">{job.title}</h1>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                job.status === "open"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : job.status === "in-progress"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  : job.status === "completed"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
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
                {job.budget?.type === "negotiable" ? (
                  <h2 className="text-indigo-400 font-medium">
                    Negotiable
                  </h2>
                ) : (
                  <h2 className="font-medium">
                    ₹ {job.budget?.amount}{" "}
                    <span className="text-zinc-400 text-sm">
                      / {job.budget?.type}
                    </span>
                  </h2>
                )}
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
              <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-400">Client</p>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">
                      {job.client?.name}
                    </h2>

                    <MessageSquare
                      onClick={handleMessageUser}
                      size={18}
                      className="cursor-pointer text-zinc-300 hover:text-white"
                    />
                  </div>
                </div>

                {job.client?.isVerified && (
                  <span className="text-blue-400 text-sm">
                    Verified
                  </span>
                )}
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
                <p className="text-sm text-zinc-400">Posted</p>
                <h2 className="font-medium">
                  {dayjs(job.createdAt).fromNow()}
                </h2>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <button
              disabled={LoadingApply}
              onClick={handleEasyApply}
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 font-medium"
            >
              {allreadyApplied ? "Applied" : "Apply"}
             
            </button>

            <button
              onClick={handleSaveJob}
              disabled={isSaved}
              className={`px-6 py-2 rounded-lg border transition ${
                isSaved
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              {isSaved ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;
