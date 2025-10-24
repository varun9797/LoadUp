import { Router } from "express";
import jobApplicationController from "./job-application.controller";
import {
    validateApplyForJob,
    validateGetApplication,
    validateGetJobApplications,
    validateUpdateStatus,
    validateGetTopApplicants
} from "./job-application.validator";

const route = Router();

// POST /job-applications/apply - Apply for a job
route.post("/apply", validateApplyForJob, jobApplicationController.applyForJob);


// GET /job-applications/job/:jobId/top - Get top applicants for a job (must be before /job/:jobId)
route.get("/job/:jobId/top", validateGetTopApplicants, jobApplicationController.getTopApplicants);

// GET /job-applications/job/:jobId - Get all applications for a specific job
route.get("/job/:jobId", validateGetJobApplications, jobApplicationController.getJobApplications);



// GET /job-applications/:applicationId - Get application by ID (must be last to avoid conflicts)
route.get("/:applicationId", validateGetApplication, jobApplicationController.getApplication);

// PUT /job-applications/:applicationId/status - Update application status
route.put("/:applicationId/status", validateUpdateStatus, jobApplicationController.updateApplicationStatus);

export default route;