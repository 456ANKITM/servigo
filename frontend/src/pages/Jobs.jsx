// import { useNavigate } from "react-router-dom";
// import Footer from "../components/Footer"
// import Navbar from "../components/Navbar"
// import { useGetAppliedJobsQuery, useGetCompletedJobsQuery, useGetCurrentJobsQuery, useGetSavedJobsQuery } from "../redux/api/api"


//   const JobCard = ({ job }) => {
//     const navigate = useNavigate();
//   return (
//     <div onClick={()=>navigate(`/jobDetails/${job._id}`)}  className=" rounded-xl p-10 shadow-md hover:shadow-lg transition bg-white cursor-pointer">
//       <h3 className="font-semibold text-lg mb-1 ">{job.title}</h3>
//       <p className="text-sm text-gray-600 line-clamp-2 mb-2 mt-5">
//         {job.description}
//       </p>
//       <div className="flex flex-wrap gap-2 mb-2">
//         {job.skills?.map((skill, i) => (
//           <span
//             key={i}
//             className="text-xs bg-gray-100 px-2 py-1 rounded-full mt-5"
//           >
//             {skill}
//           </span>
//         ))}
//       </div>
//       <div className="flex justify-between text-sm text-gray-700 mt-10">
//         <span> NPR {job.budget?.amount} / {job.budget?.type}</span>
//         <span>{job.location}</span>
//       </div>
//     </div>
//   );
// };

// const Section = ({ title, jobs }) => (
//   <div className="mb-10">
//     <h2 className="text-xl font-bold mb-4 border-b pb-2">{title}</h2>
//     {jobs?.length === 0 ? (
//       <p className="text-gray-500 text-sm">No jobs found</p>
//     ) : (
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {jobs.map((job) => (
//           <JobCard key={job._id} job={job} />
//         ))}
//       </div>
//     )}
//   </div>
// );

// const Jobs = () => {
//   const {data:appliedJobsData} = useGetAppliedJobsQuery()
//   const {data:savedJobsData} = useGetSavedJobsQuery()
//   const {data:currentJobsData} = useGetCurrentJobsQuery()
//   const {data:completedJobsData} = useGetCompletedJobsQuery()

//   const appliedJobs = appliedJobsData?.jobs || [];
//   const savedJobs = savedJobsData?.jobs || [];
//   const currentJobs = currentJobsData?.jobs || [];
//   const completedJobs = completedJobsData?.jobs || [];

//   console.log("Applied Jobs:", appliedJobs)
//   console.log("Saved Jobs:", savedJobs)
//   console.log("Current Jobs:", currentJobs)
//   console.log("Completed Jobs:", completedJobs)


//   return (
//      <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Navbar */}
//       <Navbar />

//       {/* Content */}
//       <div className="flex-1 px-4 md:px-10 py-6 max-w-7xl mx-auto w-full">
//         <Section title="💾 Saved Jobs" jobs={savedJobs} />
//         <Section title="📝 Applied Jobs" jobs={appliedJobs} />
//          <Section title=" ⚙️ Current Jobs" jobs={completedJobs} />
//         <Section title=" ✅ Completed Jobs" jobs={currentJobs} />
       
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   )
// }
// export default Jobs

import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  useGetAppliedJobsQuery,
  useGetCompletedJobsQuery,
  useGetCurrentJobsQuery,
  useGetSavedJobsQuery,
} from "../redux/api/api";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobDetails/${job._id}`)}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 hover:bg-zinc-800 hover:shadow-xl transition cursor-pointer flex flex-col gap-4"
    >
      {/* TITLE */}
      <h3 className="font-semibold text-lg text-white">
        {job.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-zinc-400 line-clamp-2">
        {job.description}
      </p>

      {/* SKILLS */}
      <div className="flex flex-wrap gap-2">
        {job.skills?.slice(0, 5).map((skill, i) => (
          <span
            key={i}
            className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-sm mt-auto">
        <span className="text-indigo-400 font-medium">
          NPR {job.budget?.amount} / {job.budget?.type}
        </span>

        <span className="text-zinc-400 text-xs">
          {job.location}
        </span>
      </div>
    </div>
  );
};

const Section = ({ title, jobs }) => (
  <div className="mb-12">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-zinc-800 pb-3">
      {title}
    </h2>

    {jobs?.length === 0 ? (
      <p className="text-zinc-500 text-sm">No jobs found</p>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    )}
  </div>
);

const Jobs = () => {
  const { data: appliedJobsData } = useGetAppliedJobsQuery();
  const { data: savedJobsData } = useGetSavedJobsQuery();
  const { data: currentJobsData } = useGetCurrentJobsQuery();
  const { data: completedJobsData } = useGetCompletedJobsQuery();

  const appliedJobs = appliedJobsData?.jobs || [];
  const savedJobs = savedJobsData?.jobs || [];
  const currentJobs = currentJobsData?.jobs || [];
  const completedJobs = completedJobsData?.jobs || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 md:px-10 py-8 max-w-7xl mx-auto w-full">
        <Section title="💾 Saved Jobs" jobs={savedJobs} />
        <Section title="📝 Applied Jobs" jobs={appliedJobs} />
        <Section title="⚙️ Current Jobs" jobs={completedJobs} />
        <Section title="✅ Completed Jobs" jobs={currentJobs} />
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;