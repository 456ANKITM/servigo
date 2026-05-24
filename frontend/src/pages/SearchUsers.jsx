import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchUsersQuery } from "../redux/api/api";
import { Star, MapPin } from "lucide-react";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const SearchUsers = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const city = params.get("city") || "";

  const { data, isLoading, error } = useSearchUsersQuery({ query });

  const users = data?.users || [];

  console.log(users);

    const formatDistance = (distance) => {
  if (distance == null) return null;

  // if less than 1 km → show meters
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  // otherwise km
  return `${distance.toFixed(1)} km away`;
};

 if(isLoading) return <SplashScreen />

 return (
  <div className="bg-zinc-950 min-h-screen flex flex-col text-white">
    <Navbar />

    {/* MAIN CONTENT */}
    <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 flex-1">
      
      {/* HEADER */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Search Results
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm mt-2">
          Query:{query}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <ErrorPage />
      )}

      {/* EMPTY STATE */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-16 sm:py-24">
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-200">
            No freelancers found
          </h2> 
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 hover:border-zinc-700 hover:shadow-xl transition-all"
          >
            {/* DISTANCE */}
            {user.distance != null && (
              <div className="flex justify-start">
                <span className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                  <MapPin size={12} />
                  {formatDistance(user.distance)}
                </span>
              </div>
            )}

            {/* TOP */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-zinc-700"
              />

              <div className="min-w-0">
                <h2 className="font-semibold text-base sm:text-lg text-white truncate">
                  {user.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 truncate">
                  {user.professionalTitle}
                </p>
              </div>
            </div>

            {/* BIO + RATING */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-zinc-400">
              <p className="truncate sm:max-w-[60%]">
                {user.bio}
              </p>

              <div className="flex items-center gap-1 whitespace-nowrap">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-white">
                  {user.ratingsAverage || 0}
                </span>
                <span className="text-zinc-500">
                  ({user.totalReviews || 0})
                </span>
              </div>
            </div>

            {/* SKILLS */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {user.skills?.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-zinc-800 text-zinc-200 px-2 sm:px-3 py-1 rounded-full border border-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() =>
                navigate(`/public/worker-profile/${user._id}`)
              }
              className="mt-auto bg-white text-black py-2 rounded-lg hover:bg-zinc-200 transition text-xs sm:text-sm font-medium"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);
};

export default SearchUsers;