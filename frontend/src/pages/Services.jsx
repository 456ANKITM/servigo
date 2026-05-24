import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useGetWorkerByServiceQuery } from "../redux/api/api";
import { MapPin } from "lucide-react";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const Services = () => {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service");
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetWorkerByServiceQuery(
    { service },
    { skip: !service }
  );

  if (isLoading)
    return (
      <p className="text-center mt-10 text-zinc-400">
        <SplashScreen />
      </p>
    );

  if (error)
    return (
      <ErrorPage />
    );

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-10 flex-1">
        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {service} Workers
        </h1>

        {/* GRID */}
        <div className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6">
          {data?.data?.map((worker) => (
            <div
              key={worker._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-15 flex flex-col justify-between hover:border-zinc-700 hover:-translate-y-1 transition"
            >
              {/* TOP */}
              <div>
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        worker.profileImage ||
                        "https://via.placeholder.com/60"
                      }
                      className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                    />

                    <div>
                      <h2 className="font-semibold text-lg">
                        {worker.name}
                      </h2>
                      <p className="text-sm text-zinc-400">
                        {worker.professionalTitle || "Worker"}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${
                      worker.availability === "available"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {worker.availability}
                  </span>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">
                      {worker.ratingsAverage || 0}
                    </p>
                    <p className="text-xs text-zinc-400">Rating</p>
                  </div>

                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">
                      {worker.totalReviews || 0}
                    </p>
                    <p className="text-xs text-zinc-400">Reviews</p>
                  </div>

                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2">
                    <p className="text-sm font-semibold text-white">
                      {worker.completedJobsCount || 0}
                    </p>
                    <p className="text-xs text-zinc-400">Jobs</p>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                  <MapPin size={14} />
                  {worker.city || "Location not specified"}
                </div>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills?.length > 0 ? (
                    worker.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 text-xs">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  navigate(`/public/worker-profile/${worker._id}`)
                }
                className="mt-2 w-full bg-white text-black py-2 rounded-xl font-medium hover:bg-zinc-200 transition"
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

export default Services;