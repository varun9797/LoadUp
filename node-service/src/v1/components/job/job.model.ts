import { Schema, model, Document } from 'mongoose';
import { IQuestion, IJob } from "./../../types"

// Question schema for embedded questions
const questionSchema = new Schema({
    // id: {
    //     type: String,
    //     required: [true, 'Question ID is required'],
    //     trim: true
    // },
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
            values: ['multiple-choice', 'single-choice', 'text', 'boolean', 'rating'],
            message: 'Question type must be one of: multiple-choice, text, boolean, rating'
        }
    },
    options: {
        type: [String],
        validate: {
            validator: function (this: any, options: string[]) {
                // Options are required for multiple-choice questions
                if (this.type === 'multiple-choice' || this.type === 'single-choice') {
                    return options && options.length >= 2;
                }
                return true;
            },
            message: 'Multiple-choice questions must have at least 2 options'
        }
    },
    correctAnswer: {
        type: Schema.Types.Mixed,
        validate: {
            validator: function (this: any, value: any) {
                if (value === null || value === undefined) return true; // Allow undefined or null
                switch (this.type) {
                    case 'multiple-choice':
                        return Array.isArray(value) && value.every(v => this.options.includes(v));
                    case 'single-choice':
                        return typeof value === 'string' && this.options.includes(value);
                    case 'text':
                        return typeof value === 'string';
                    case 'rating':
                        return typeof value === 'number';
                }
            }
        },
        message: function (this: any) {
            switch (this.type) {
                case 'single-choice':
                    return 'Single-choice correct answer must be a string from the available options';
                case 'multiple-choice':
                    return 'Multiple-choice correct answer must be an array of strings from the available options';
                case 'rating':
                    return 'Rating correct answer must be a number between 1 and 10';
                case 'text':
                    return 'Text correct answer must be a non-empty string';
                default:
                    return 'Invalid question type for correct answer validation';
            }
        }
    },
    scoring: {
        type: Number,
        required: [true, 'Question scoring is required'],
        min: [0, 'Scoring must be a positive number'],
        max: [100, 'Scoring cannot exceed 100']
    }
},
    {
        toJSON: {
            virtuals: true,
            versionKey: false, // removes __v
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    });

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
        validate: [
            {
                validator: (questions: IQuestion[]) => {
                    return questions && questions.length > 0;
                },
                message: 'At least one question must be provided'
            }
        ]
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false
});

// Create and export the Job model
export const Job = model<IJob>('jobs', jobSchema);

export default Job;