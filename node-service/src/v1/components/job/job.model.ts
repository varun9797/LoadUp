import { Schema, model, Document } from 'mongoose';

// Interface for question
export interface IQuestion {
    id: string;
    text: string;
    type: 'multiple-choice' | 'text' | 'boolean' | 'rating';
    options?: string[];
    scoring: number;
}

// Interface for job posting document
export interface IJob extends Document {
    title: string;
    location: string;
    customer: string;
    jobName: string;
    description: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

// Question schema for embedded questions
const questionSchema = new Schema({
    id: {
        type: String,
        required: [true, 'Question ID is required'],
        trim: true
    },
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
        maxlength: [500, 'Question text cannot exceed 500 characters']
    },
    type: {
        type: String,
        required: [true, 'Question type is required'],
        enum: {
            values: ['multiple-choice', 'text', 'boolean', 'rating'],
            message: 'Question type must be one of: multiple-choice, text, boolean, rating'
        }
    },
    options: {
        type: [String],
        validate: {
            validator: function (this: any, options: string[]) {
                // Options are required for multiple-choice questions
                if (this.type === 'multiple-choice') {
                    return options && options.length >= 2;
                }
                return true;
            },
            message: 'Multiple-choice questions must have at least 2 options'
        }
    },
    scoring: {
        type: Number,
        required: [true, 'Question scoring is required'],
        min: [0, 'Scoring must be a positive number'],
        max: [100, 'Scoring cannot exceed 100']
    }
}, { _id: false });

// Job schema
const jobSchema = new Schema<IJob>({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Job location is required'],
        trim: true
    },
    customer: {
        type: String,
        required: [true, 'Customer is required'],
        trim: true
    },
    jobName: {
        type: String,
        required: [true, 'Job name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    questions: {
        type: [questionSchema],
        required: [true, 'At least one question is required'],
        validate: {
            validator: function (questions: IQuestion[]) {
                return questions && questions.length > 0;
            },
            message: 'At least one question must be provided'
        }
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false
});

// Create and export the Job model
export const Job = model<IJob>('Job', jobSchema);

export default Job;