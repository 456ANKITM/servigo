import express from "express";
import { protect } from "../middleware/auth.js";
import { addReview, getAppliedJobs, getCompletedJobs, getCurrentJobs, getSavedJobs,  getUserAgreements,  getUserById, getUserProfile, getUserReviews, getWorkerByService, rateUser, saveJob, searchUser, updateLocation, updateProfile } from "../controllers/userController.js";
import { uploadFields } from "../middleware/upload.js";

const router = express.Router();

router.get("/get-user", protect, getUserProfile);
router.put("/update-profile", protect, uploadFields, updateProfile);
router.get("/searchUser", protect, searchUser )
router.get("/services", getWorkerByService);
router.get("/savedJobs", protect, getSavedJobs);
router.get("/appliedJobs", protect, getAppliedJobs);
router.get("/current-jobs", protect, getCompletedJobs);
router.get("/completed-jobs", protect, getCurrentJobs);
router.put("/update-location", protect, updateLocation)
router.get("/get-user-agreements", protect, getUserAgreements);
router.get("/:userId", getUserById); 
router.post("/rate/:userId", protect, rateUser);
router.post("/review/:userId", protect, addReview);
router.get("/reviews/:userId", protect, getUserReviews);
router.post("/save/:jobId", protect, saveJob);


export default router;