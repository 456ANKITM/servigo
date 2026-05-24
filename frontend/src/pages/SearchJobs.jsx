import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSearchJobsQuery } from '../redux/api/api'
import { MapPin } from 'lucide-react'
import SplashScreen from './SplashScreen'

const SearchJobs = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const search = params.get("search") || "";
    const {data, isLoading, error} = useSearchJobsQuery({search});
    const jobs = data?.jobs || [];
    if(isLoading) return <SplashScreen />
    return (
  <div className="bg-zinc-950 min-h-screen flex flex-col text-white">
    <Navbar />

    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-1">
      
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Job Search Results
        </h1>

        <p className="text-zinc-400 text-sm mt-2">
          Search:{" "}
          <span className="text-white font-medium">
            {search || "All"}
          </span>
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-zinc-400 text-sm">Loading Jobs...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">Error Loading Jobs</p>
      )}

      {/* Empty */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-200">
            No Jobs Found
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Try different search keywords
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 hover:border-zinc-700 hover:shadow-xl transition-all"
          >
            {/* Title */}
            <h2 className="font-semibold text-base sm:text-lg text-white">
              {job.title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
              {job.description}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs sm:text-sm text-zinc-400">
              <MapPin size={14} />
              {job.location}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {job.skills?.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-zinc-800 text-zinc-200 px-2 sm:px-3 py-1 rounded-full border border-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Budget + CTA */}
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs sm:text-sm font-medium text-white">
                ₹ {job.budget?.amount || 0}{" "}
                <span className="text-zinc-400">
                  / {job.budget?.type}
                </span>
              </span>

              <button
                onClick={() => navigate(`/jobdetails/${job._id}`)}
                className="bg-white text-black px-3 sm:px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition text-xs sm:text-sm font-medium"
              >
                View Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);
}

export default SearchJobs
