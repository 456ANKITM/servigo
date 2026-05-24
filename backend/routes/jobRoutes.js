import express from "express";
import { protect } from "../middleware/auth.js";
import { addJob, getAllJobs, getJobsByClient, deleteJob, getJobById, searchJobs, easyApplyJob, getAppliedWorkersRanked, hireWorker, markJobCompleted, getRecommendedJobs  } from "../controllers/jobController.js";

const router = express.Router();

router.get("/",  getAllJobs);
router.post("/", protect, addJob);
router.get("/getJobsByClient", protect, getJobsByClient)
router.get("/searchJobs", searchJobs);
router.get("/browse-jobs", protect, getRecommendedJobs);
router.get("/:jobId", getJobById);
router.delete("/deleteJob/:jobId", protect, deleteJob)
router.post("/apply/:jobId", protect, easyApplyJob)
router.get("/applied-workers/:jobId", protect, getAppliedWorkersRanked)
router.post("/:jobId/hire/:userId", protect, hireWorker);
router.patch("/mark-completed/:jobId", protect, markJobCompleted);


export default router; 