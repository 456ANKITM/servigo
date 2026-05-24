import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddReviewMutation,
  useCreateConversationMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useRateUserMutation,
} from "../redux/api/api";
import { MapPin, MessageSquare, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import SplashScreen from "./SplashScreen";
import ErrorPage from "../components/Error";

const WorkerPublicView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetUserByIdQuery(userId);

  const [rateUser] = useRateUserMutation();
  const [addReview, { isLoading: addingReview }] = useAddReviewMutation();
  const { data: reviewData, refetch: refetchReviews } =
    useGetUserReviewsQuery(userId);
  const [createConversation] = useCreateConversationMutation();

  const currentUser = useSelector((state) => state.auth.user);
  const user = data?.user;

  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [comment, setComment] = useState("");

  const requireAuth = (currentUser) => {
    if (!currentUser) {
      toast.error("Please login first!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (user && currentUser?._id) {
      const existing = user.ratings?.find(
        (r) => r.userId?.toString() === currentUser._id.toString()
      );

      if (existing) {
        setRating(existing.rating);
        setHasRated(true);
      }
    }
  }, [user, currentUser]);

  const handleRating = async (value) => {
    if (!requireAuth(currentUser)) return;
    if (hasRated) return;

    setRating(value);

    try {
      const res = await rateUser({ userId, rating: value }).unwrap();
      if (res.success) {
        toast.success(res.message);
        setHasRated(true);
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to rate user");
    }
  };

  const handleAddReview = async () => {
    if (!requireAuth(currentUser)) return;
    if (!comment.trim()) return toast.error("Write a review first");

    try {
      const res = await addReview({ userId, comment }).unwrap();
      if (res.success) {
        toast.success("Review added successfully");
        refetchReviews();
        setComment("");
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add review");
    }
  };

  const handleMessageUser = async () => {
    if (!requireAuth(currentUser)) return;

    try {
      const res = await createConversation({
        receiverId: userId,
      }).unwrap();

      if (res.success) {
        navigate(`/chat?conversationId=${res.conversation._id}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  if (isLoading) return <SplashScreen />
  if (error) return <ErrorPage />

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="min-h-screen px-4 md:px-10 py-10">
        {/* PROFILE CARD */}
        <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            {/* LEFT */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.profileImage || "https://via.placeholder.com/120"}
                className="w-40 h-40 rounded-2xl object-cover border border-zinc-700"
              />

              <button
                onClick={handleMessageUser}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition text-sm font-medium"
              >
                <MessageSquare size={18} />
                Message
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>

              <p className="text-zinc-400 mt-1">
                {user.professionalTitle || "Freelancer"}
              </p>

              <div className="flex items-center gap-2 text-zinc-400 text-sm mt-2 justify-center md:justify-start">
                <MapPin size={14} />
                {user.city}
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    user.availability?.status === "available"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : user.availability?.status === "busy"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}
                >
                  {user.availability}
                </span>
              </div>

              {/* SKILLS */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* BIO */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-zinc-400">
                  {user.bio || "No bio provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="max-w-5xl mx-auto mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Ratings & Reviews</h2>

            <div className="text-right">
              <p className="text-yellow-400 font-bold text-xl">
                ⭐ {user.ratingsAverage?.toFixed(1) || "0.0"}
              </p>
              <p className="text-zinc-400 text-sm">
                ({user.totalReviews || 0} reviews)
              </p>
            </div>
          </div>

          {/* STARS */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleRating(star)}
                className={`cursor-pointer transition ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-600"
                } ${hasRated ? "pointer-events-none opacity-60" : ""}`}
              />
            ))}
          </div>

          {/* REVIEW INPUT */}
          <div className="mt-6 bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write review..."
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white outline-none"
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddReview}
                disabled={addingReview}
                className="bg-white text-black px-5 py-2 rounded-lg hover:bg-zinc-200 transition text-sm font-medium"
              >
                {addingReview ? "Posting..." : "Post Review"}
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="mt-8 space-y-4">
            {reviewData?.reviews?.map((review) => (
              <div
                key={review._id}
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl"
              >
                <div className="flex gap-3">
                  <img
                    src={
                      review.reviewer.profileImage ||
                      "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full"
                  />

                  <div>
                    <h4 className="font-semibold">
                      {review.reviewer?.name}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {moment(review.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-zinc-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorkerPublicView;