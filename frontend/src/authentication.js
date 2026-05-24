import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const useAuth = () => {
  const user = useSelector((state) => state.auth.user);

  const requireAuth = (callback) => {
    return (...args) => {
      if (!user) {
        toast.error("Please log in first");
        return;
      }
      return callback(...args);
    };
  };

  return { user, requireAuth };
};