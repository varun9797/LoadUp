import { Schema, model, Document } from 'mongoose';


// Interface for question
export interface IQuestion {
    id: string;
    text: string;
    type: 'multiple-choice' | 'single-choice' | 'text' | 'boolean' | 'rating';
    // How to add correct answer field?
    correctAnswer?: string | string[] | number | boolean | IRange;
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

export interface IRange {
    min: Number,
    max: Number
}
