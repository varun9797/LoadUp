import Job, { IJob } from "./job.model";

class JobService {

    // Create a new job posting
    async createJob(jobData: Partial<IJob>): Promise<IJob> {
        try {
            const newJob = new Job(jobData);
            const savedJob = await newJob.save();
            return savedJob;
        } catch (error) {
            throw error;
        }
    }

    // Get all jobs
    async getAllJobs(): Promise<IJob[]> {
        try {
            const jobs = await Job.find().sort({ createdAt: -1 });
            return jobs;
        } catch (error) {
            throw error;
        }
    }

    // Get job by ID
    async getJobById(jobId: string): Promise<IJob | null> {
        try {
            const job = await Job.findById(jobId);
            return job;
        } catch (error) {
            throw error;
        }
    }

    // Update job
    async updateJob(jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
        try {
            const updatedJob = await Job.findByIdAndUpdate(
                jobId,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedJob;
        } catch (error) {
            throw error;
        }
    }

    // Delete job
    async deleteJob(jobId: string): Promise<boolean> {
        try {
            const deletedJob = await Job.findByIdAndDelete(jobId);
            return !!deletedJob;
        } catch (error) {
            throw error;
        }
    }
}

export default new JobService();
