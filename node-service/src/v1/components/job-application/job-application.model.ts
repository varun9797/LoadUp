import { Schema, model, Document } from 'mongoose';

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

// Answer schema for embedded answers
const answerSchema = new Schema({
    questionId: {
        type: String,
        required: [true, 'Question ID is required'],
        trim: true
    },
    answer: {
        type: Schema.Types.Mixed,
        required: [true, 'Answer is required']
    },
    score: {
        type: Number,
        min: [0, 'Score must be a positive number'],
        default: 0
    }
}, { _id: false });

// Job application schema
const jobApplicationSchema = new Schema<IJobApplication>({
    jobId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Job ID is required'],
        ref: 'Job'
    },
    applicantId: {
        type: String,
        required: [true, 'Applicant ID is required'],
        trim: true
    },
    applicantName: {
        type: String,
        required: [true, 'Applicant name is required'],
        trim: true,
        maxlength: [100, 'Applicant name cannot exceed 100 characters']
    },
    applicantEmail: {
        type: String,
        required: [true, 'Applicant email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    answers: {
        type: [answerSchema],
        required: [true, 'Answers are required'],
        validate: {
            validator: function (answers: IAnswer[]) {
                return answers && answers.length > 0;
            },
            message: 'At least one answer must be provided'
        }
    },
    totalScore: {
        type: Number,
        required: true,
        min: [0, 'Total score must be a positive number'],
        default: 0
    },
    maxPossibleScore: {
        type: Number,
        required: true,
        min: [0, 'Max possible score must be a positive number'],
        default: 0
    },
    scorePercentage: {
        type: Number,
        min: [0, 'Score percentage must be between 0 and 100'],
        max: [100, 'Score percentage must be between 0 and 100'],
        default: 0
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'reviewed', 'accepted', 'rejected'],
            message: 'Status must be one of: pending, reviewed, accepted, rejected'
        },
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true,
    versionKey: false
});

// Indexes
jobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true }); // Prevent duplicate applications
jobApplicationSchema.index({ jobId: 1, status: 1 }); // Query applications by job and status
jobApplicationSchema.index({ applicantEmail: 1 }); // Query by applicant email
jobApplicationSchema.index({ scorePercentage: -1 }); // Sort by score

// Pre-save middleware to calculate score percentage
jobApplicationSchema.pre('save', function (next) {
    if (this.maxPossibleScore > 0) {
        this.scorePercentage = Math.round((this.totalScore / this.maxPossibleScore) * 100);
    } else {
        this.scorePercentage = 0;
    }
    next();
});

// Create and export the JobApplication model
export const JobApplication = model<IJobApplication>('job_applications', jobApplicationSchema);

export default JobApplication;