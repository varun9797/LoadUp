

import { Request, Response } from "express";
import jobApplicationService from "./job-application.service";
import ResponseHandler from "../../utils/response";
import { IJobApplication } from "./../../types"

class JobApplicationController {
    constructor() { }

    // Apply for a job
    async applyForJob(req: Request, res: Response): Promise<void> {
        try {
            const { jobId, applicantId, applicantName, applicantEmail, answers } = req.body;

            // Apply for job using service (validation is handled by Joi middleware)
            const application = await jobApplicationService.applyForJob({
                jobId,
                applicantId,
                applicantName,
                applicantEmail,
                answers
            });

            const responseData = {
                applicationId: application._id,
                totalScore: application.totalScore,
                maxPossibleScore: application.maxPossibleScore,
                scorePercentage: application.scorePercentage,
                status: application.status,
                appliedAt: application.appliedAt
            };

            ResponseHandler.created(res, responseData, "Application submitted successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Get application by ID
    async getApplication(req: Request, res: Response): Promise<void> {
        try {
            const { applicationId } = req.params;

            const application = await jobApplicationService.getApplicationById(applicationId);

            if (!application) {
                ResponseHandler.notFound(res, "Application not found");
                return;
            }

            ResponseHandler.success(res, application);

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Get applications for a job (for employers)
    async getJobApplications(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const applications = await jobApplicationService.getApplicationsByJob(jobId);

            ResponseHandler.success(res, applications, "Applications retrieved successfully", 200, applications.length);

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Update application status
    async updateApplicationStatus(req: Request, res: Response): Promise<void> {
        try {
            const { applicationId } = req.params;
            const { status, reviewedBy, notes } = req.body;

            const updatedApplication = await jobApplicationService.updateApplicationStatus(
                applicationId,
                status,
                reviewedBy,
                notes
            );

            if (!updatedApplication) {
                ResponseHandler.notFound(res, "Application not found");
                return;
            }

            ResponseHandler.success(res, updatedApplication, "Application status updated successfully");

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

    // Get top applicants for a job
    async getTopApplicants(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const { limit } = req.query;

            const topApplicants = await jobApplicationService.getTopApplicants(
                jobId,
                parseInt(limit as string) || 10
            );

            ResponseHandler.success(res, topApplicants, "Top applicants retrieved successfully", 200, topApplicants.length);

        } catch (error: any) {
            ResponseHandler.handleAsyncError(error, res);
        }
    }

}

export default new JobApplicationController();