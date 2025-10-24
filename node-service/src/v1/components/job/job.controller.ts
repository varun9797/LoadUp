import { Request, Response } from "express";
import jobService from "./job.service";
import ResponseHandler from "../../utils/response";

class JobController {

    constructor() {

    }

    // Create a new job posting
    async createJob(req: Request, res: Response): Promise<void> {
        try {
            const { title, location, customer, jobName, description, questions } = req.body;

            // Create job using service (validation is handled by Joi middleware)
            const savedJob = await jobService.createJob({
                title,
                location,
                customer,
                jobName,
                description,
                questions
            });

            ResponseHandler.created(res, savedJob, "Job created successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Get all jobs
    async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const jobs = await jobService.getAllJobs();
            ResponseHandler.success(res, jobs, "Jobs retrieved successfully", 200, jobs.length);

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Get job by ID
    async getJobById(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const job = await jobService.getJobById(jobId);

            if (!job) {
                ResponseHandler.notFound(res, "Job not found");
                return;
            }

            ResponseHandler.success(res, job, "Job retrieved successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Update job
    async updateJob(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const updateData = req.body;

            const updatedJob = await jobService.updateJob(jobId, updateData);

            if (!updatedJob) {
                ResponseHandler.notFound(res, "Job not found");
                return;
            }

            ResponseHandler.success(res, updatedJob, "Job updated successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Delete job
    async deleteJob(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const deleted = await jobService.deleteJob(jobId);

            if (!deleted) {
                ResponseHandler.notFound(res, "Job not found");
                return;
            }

            ResponseHandler.success(res, null, "Job deleted successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

}

export default new JobController();