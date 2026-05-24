import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Trash2, Camera } from "lucide-react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetJobsByClientQuery,
  useMarkJobCompletedMutation,
  useDeleteJobMutation,
} from "../redux/api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import dummyProfile from "../assets/dummy-profile.jpg";
import toast from "react-hot-toast";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const ClientProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    city: "",
    profileImage: "",
  });

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: jobs } = useGetJobsByClientQuery();
  const [markJobCompleted] = useMarkJobCompletedMutation();
  const [deleteJob] = useDeleteJobMutation();

  const user = data?.data;

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || "Your Name",
      bio: user.bio || "Write about yourself",
      city: user.city || "Your City",
      profileImage: user.profileImage || dummyProfile,
    });
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      formData.append("city", profile.city);
      if (file) formData.append("profileImage", file);

      const res = await updateUser(formData).unwrap();
      dispatch(setUser(res.user));
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const jobCompletion = async (jobId) => {
    try {
      const res = await markJobCompleted(jobId).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch();
      } else toast.error(res.message);
    } catch (e) {
      toast.error("Failed to mark completed");
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId).unwrap();
      refetch();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  if (isLoading)  <SplashScreen />

  if (error) <ErrorPage />

  return (
    <div className=" bg-zinc-950 min-h-screen">
      <Navbar />

      <div className="max-w-5xl  mx-auto px-4 py-6 space-y-10">

        {/* PROFILE CARD */}
        <div className=" border bg-zinc-900  rounded-2xl shadow-sm p-6 md:p-8">

          {/* Actions */}
          <div className="flex justify-end gap-2 mb-6">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-zinc-200 text-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-300"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Image */}
           <div className="relative group w-fit">
  
  {/* INPUT */}
  <input
    type="file"
    id="img"
    className="hidden"
    onChange={handleImageChange}
  />

  {/* IMAGE WRAPPED IN LABEL */}
  <label htmlFor="img" className={editing ? "cursor-pointer" : ""}>
    <img
      src={previewImage || profile.profileImage || dummyProfile}
      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-zinc-300"
    />
  </label>

  {/* OVERLAY */}
  {editing && (
    <label
      htmlFor="img"
      className="absolute inset-0 bg-black/50 flex items-center justify-center 
                 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer h-32 "
    >
      <Camera className="text-white w-6 h-6" />
    </label>
  )}
</div>

            {/* Info */}
            <div className="flex-1 space-y-3">

              {editing ? (
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="text-2xl text-white font-bold w-full outline-none  border-zinc-300"
                />
              ) : (
                <h2 className="text-2xl  font-bold text-white">
                  {profile.name}
                </h2>
              )}

              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <MapPin size={14} />
                {editing ? (
                  <input
                    value={profile.city}
                    placeholder="Enter Your City"
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                    className="outline-none  border-zinc-300 w-full"
                  />
                ) : (
                  <span>{profile.city || "Your City"}</span>
                )}
              </div>

              {editing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Write about Yourself"
                  className="w-full text-white  border-zinc-200 rounded-lg p-2 outline-none"
                />
              ) : (
                <p className="text-white">{profile.bio || "Write about yourself"}</p>
              )}
            </div>
          </div>
        </div>

        {/* JOBS */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Your Jobs
            </h1>

            <button
              onClick={() => navigate("/post-job")}
              className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800"
            >
              + Post Job
            </button>
          </div>

          {jobs?.jobs?.length === 0 ? (
            <p className="text-zinc-500">No Jobs Posted Yet</p>
          ) : (
            <div className="grid  md:grid-cols-2 gap-6">
              {jobs?.jobs?.map((job) => (
                <div
                  key={job._id}
                  onClick={() => navigate(`/jobdetails/${job._id}`)}
                  className="bg-zinc-900 border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {job.title}
                  </h3>

                  <p className="text-zinc-500 text-sm mt-2">
                    {job.description}
                  </p>

                  <p className="text-zinc-600 text-sm mt-4">
                    {job.location}
                  </p>

                  <div
                    className="flex justify-between items-center mt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/job/${job._id}/workers`)}
                        className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-md text-sm hover:bg-zinc-200"
                      >
                        Applied Workers
                      </button>

                      <button
                        onClick={() => jobCompletion(job._id)}
                        className="bg-zinc-800 text-white px-3 py-1 rounded-md text-sm "
                      >
                        {job.status === "completed"
                          ? "Completed"
                          : "Mark Done"}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientProfile;

