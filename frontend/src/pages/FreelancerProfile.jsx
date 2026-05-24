import { useState, useEffect } from "react";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/api/api";
import Navbar from "../components/Navbar";
import dummyProfile from "../assets/dummy-profile.jpg";
import { Camera, MapPin } from "lucide-react";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const FreelancerProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    skills: [],
    city: "",
    profileImage: "",
    professionalTitle: "",
  });

  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [availability, setAvailability] = useState("available");
  const [newSkill, setNewSkill] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const dispatch = useDispatch();

  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = data?.data;

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    if (profile.skills.includes(skill)) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, skill],
    });

    setNewSkill("");
  };

  const removeSkill = (index) => {
    const updated = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updated });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("bio", profile.bio);
      formData.append("professionalTitle", profile.professionalTitle);
      formData.append("city", profile.city);
      formData.append("availability", availability);
      formData.append("skills", JSON.stringify(profile.skills));

      if (file) {
        formData.append("profileImage", file);
      }

      const res = await updateUser(formData).unwrap();
      dispatch(setUser(res.user));
      setEditing(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || "",
      bio: user.bio || "",
      city: user.city || "",
      profileImage: user.profileImage || "",
      professionalTitle: user.professionalTitle || "",
      skills: user.skills || [],
    });
    setAvailability(user.availability || "available");
  }, [user]);

  if (isLoading) return <SplashScreen />
  if (error) return <ErrorPage />

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6 text-white">

        {/* Profile Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">

          {/* Actions */}
          <div className="flex justify-end gap-2 mb-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  {isUpdating ? "Updating..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-zinc-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">

            {/* Image */}
            <div className="relative group w-fit">
              <input type="file" hidden id="img" onChange={handleImageChange} />

              <img
                src={previewImage || profile.profileImage || dummyProfile}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-500"
                onClick={() => {
                  if (editing) document.getElementById("img").click();
                }}
              />

              {editing && (
                <div
                  onClick={() => document.getElementById("img").click()}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full h-32"
                >
                  <Camera className="text-white w-6 h-6"  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">

              {/* Name */}
              {editing ? (
                <input
                  className=" px-3 py-2 rounded-lg text-xl font-bold w-full outline-none"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              ) : (
                <h2 className="text-2xl font-bold">{profile.name}</h2>
              )}

              {/* Title */}
              {editing ? (
                <input
                  className="  px-3 py-2 rounded-lg w-full outline-none"
                  value={profile.professionalTitle}
                  placeholder="Enter Your Professional title"
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      professionalTitle: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-gray-400">
                  {profile.professionalTitle || "Your Professional Title"}
                </p>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                {editing ? (
                  <input
                    className="px-2 py-1 rounded w-full outline-none"
                    placeholder="Enter Your City"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                ) : (
                  <span className="text-white">{profile.city || "Enter Your City"}</span>
                )}
              </div>

              {/* Bio */}
              {editing ? (
                <textarea
                  className="px-3 py-2 rounded-lg w-full outline-none"
                  value={profile.bio}
                  placeholder="Writea about yourself"
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
              ) : (
                <p className="text-gray-300">{profile.bio || "Write about yourself"}</p>
              )}

              {/* Availability */}
              <div className="flex justify-end">
                {editing ? (
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="bg-zinc-800 border border-white/10 px-3 py-2 rounded-lg"
                  >
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                  </select>
                ) : (
                  <p
                    className={
                      availability === "available"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {availability}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold">
              {user?.savedJobs?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Saved Jobs</p>
          </div>
          <div>
            <p className="text-xl font-bold">
              {user?.appliedJobs?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Applied Jobs</p>
          </div>
          <div>
            <p className="text-xl font-bold">
              {user?.currentJobs?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Current Jobs</p>
          </div>
          <div>
            <p className="text-xl font-bold">
              {user?.completedJobs?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Completed Jobs</p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Services</h3>

          {user?.services?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {user.services.map((service, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-xl p-3 text-center bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  <p className="text-sm">{service}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No services added yet
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>

          {editing ? (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 bg-zinc-800 border border-white/10 px-3 py-2 rounded-lg"
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="bg-indigo-600 px-4 rounded-lg"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full"
                  >
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(index)}>×</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-zinc-800 p-3 px-4 flex items-center  h-10 py-1 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No skills added yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreelancerProfile;