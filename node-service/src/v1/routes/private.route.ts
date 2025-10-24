import { Router } from "express";
import jobRouter from "../components/job/job.router";
import jobApplicationRoutes from "../components/job-application/job-application.router";
const privateRouter = Router();

// We can add auth middleware here for checking JWT token
privateRouter.use("/jobs", jobRouter)
privateRouter.use("/job-applications", jobApplicationRoutes)

export { privateRouter };