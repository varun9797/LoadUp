import { Router } from "express";
import jobController from "./job.controller";
import {
    validateCreateJob,
    validateUpdateJob,
    validateJobIdParam
} from "./job.validator";

const route = Router();

// POST /jobs - Create a new job
route.post("/", validateCreateJob, jobController.createJob);

// GET /jobs - Get all jobs
route.get("/", jobController.getAllJobs);

// GET /jobs/:jobId - Get job by ID
route.get("/:jobId", validateJobIdParam, jobController.getJobById);

// PUT /jobs/:jobId - Update job by ID
route.put("/:jobId", validateUpdateJob, jobController.updateJob);

// DELETE /jobs/:jobId - Delete job by ID
route.delete("/:jobId", validateJobIdParam, jobController.deleteJob);

export default route;