import { Schema, Document } from 'mongoose';

// Interface for answer
export interface IAnswer {
    questionId: string;
    answer: string | string[] | number | boolean;
    score?: number;
}

// Interface for job application
export interface IJobApplication extends Document {
    jobId: Schema.Types.ObjectId;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    answers: IAnswer[];
    totalScore: number;
    maxPossibleScore: number;
    scorePercentage: number;


    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    appliedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    notes?: string;


    createdAt: Date;
    updatedAt: Date;
}

export interface IApplyJobData {
    jobId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    answers: IAnswer[];
}