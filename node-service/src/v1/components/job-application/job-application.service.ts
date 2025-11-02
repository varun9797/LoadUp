import JobApplication from "./job-application.model";
import Job from "../job/job.model";
import { IQuestion, IJobApplication, IAnswer, IApplyJobData } from "./../../types"
import logger from "../../../config/logger";

class JobApplicationService {

    // Apply for a job
    async applyForJob(applicationData: IApplyJobData): Promise<IJobApplication> {
        try {
            const { jobId, applicantId, applicantName, applicantEmail, answers } = applicationData;

            // Check if the job exists
            const job = await Job.findById(jobId);
            if (!job) {
                throw new Error('Job not found');
            }

            // Check if applicant has already applied for this job
            const existingApplication = await JobApplication.findOne({
                jobId,
                applicantId
            });

            if (existingApplication) {
                throw new Error('You have already applied for this job');
            }

            // Calculate scores for each answer
            const scoredAnswers = this.calculateAnswerScores(answers, job.questions);
            // Calculate total and max possible scores
            const totalScore = scoredAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);
            const maxPossibleScore = job.questions.reduce((sum, question) => sum + question.scoring, 0);

            // Create new job application
            const newApplication = new JobApplication({
                jobId,
                applicantId,
                applicantName,
                applicantEmail,
                answers: scoredAnswers,
                totalScore,
                maxPossibleScore,
                status: 'pending',
                appliedAt: new Date()
            });

            // Save the application
            const savedApplication = await newApplication.save();
            return savedApplication;

        } catch (error) {
            logger.error('Error in applyForJob:', error);
            throw error;
        }
    }

    // Calculate scores for answers based on job questions
    private calculateAnswerScores(answers: IAnswer[], jobQuestions: IQuestion[]): IAnswer[] {
        const questionMap = new Map();
        jobQuestions.forEach(q => questionMap.set(q.id, q));
        return answers.map(answer => {
            const question: IQuestion = questionMap.get(answer.questionId);
            let score = 0;
            if (!question) {
                throw new Error("Question not found for the given answer");
            }
            if (question && answer.answer !== null && answer.answer !== undefined && answer.answer !== '') {
                // Basic scoring logic - you can enhance this based on question type
                switch (question.type) {
                    case 'multiple-choice':
                        // Award full points if answered
                        // score = question.scoring;
                        score = 0;
                        let totalCorrectAnwersByCandidate = 0;
                        let awardedPoints = question.scoring

                        if (Array.isArray(question.correctAnswer) && Array.isArray(answer.answer)) {
                            answer.answer.forEach((ans) => {
                                if (Array.isArray(question.correctAnswer)) {
                                    if (question.correctAnswer.includes(ans)) {
                                        totalCorrectAnwersByCandidate += 1;
                                    }
                                }
                            })

                            score = awardedPoints * (totalCorrectAnwersByCandidate / question.correctAnswer.length);
                        } else {
                            throw new Error("Invalid answer type")
                        }
                        break;
                    case 'single-choice':
                        // Award full points if answered
                        // score = question.scoring;
                        score = 0;
                        if (typeof answer.answer === 'string' && answer.answer === question.correctAnswer) {
                            score = question.scoring;
                        }
                        break;
                    case 'text':
                        // Award points based on text length (basic logic)
                        const textLength = typeof answer.answer === 'string' ? answer.answer.length : 0;
                        score = textLength > 50 ? question.scoring : Math.floor(question.scoring * 0.5);
                        break;
                    case 'boolean':
                        // Award full points if answered
                        score = 0;
                        if (typeof answer.answer === 'boolean' && answer.answer === question.correctAnswer) {
                            question.scoring
                        }
                        break;
                    case 'rating':
                        // Award points based on rating value
                        const rating = typeof answer.answer === 'number' ? answer.answer : 0;
                        score = Math.floor((rating / 10) * question.scoring);
                        break;
                    default:
                        score = question.scoring;
                }
                console.log(`Question ID: ${question.id}, Answer: ${answer.answer}, Score: ${score}, type: ${question.type}, question scoring: ${question.scoring}`);
            }

            return {
                ...answer,
                score: Math.min(score, question.scoring) // Cap at question's max score
            };
        });
    }

    // Get all applications for a specific job
    async getApplicationsByJob(jobId: string): Promise<IJobApplication[]> {
        try {
            const applications = await JobApplication.find({ jobId }).sort({ scorePercentage: -1, appliedAt: 1 });
            return applications;
        } catch (error) {
            throw error;
        }
    }

    // Get application by ID
    async getApplicationById(applicationId: string): Promise<IJobApplication | null> {
        try {
            const application = await JobApplication.findById(applicationId).populate('jobId');
            return application;
        } catch (error) {
            throw error;
        }
    }

    // Update application status
    async updateApplicationStatus(
        applicationId: string,
        status: string,
        reviewedBy?: string,
        notes?: string
    ): Promise<IJobApplication | null> {
        try {
            const application = await JobApplication.findById(applicationId);
            if (!application) {
                throw new Error('Application not found');
            }

            application.status = status as any;
            application.reviewedAt = new Date();
            if (reviewedBy) application.reviewedBy = reviewedBy;
            if (notes) application.notes = notes;

            await application.save();
            return application;
        } catch (error) {
            throw error;
        }
    }

    // Get top applicants for a job
    async getTopApplicants(jobId: string, limit: number = 10): Promise<IJobApplication[]> {
        try {
            const topApplicants = await JobApplication.find({ jobId })
                .sort({ scorePercentage: -1, appliedAt: 1 })
                .limit(limit);
            return topApplicants;
        } catch (error) {
            throw error;
        }
    }
}

export default new JobApplicationService();
