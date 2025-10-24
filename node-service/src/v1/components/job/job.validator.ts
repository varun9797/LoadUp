import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Question validation schema
const questionSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Question ID is required',
        'any.required': 'Question ID is required'
    }),
    text: Joi.string().max(500).required().messages({
        'string.empty': 'Question text is required',
        'string.max': 'Question text cannot exceed 500 characters',
        'any.required': 'Question text is required'
    }),
    type: Joi.string().valid('multiple-choice', 'text', 'boolean', 'rating').required().messages({
        'any.only': 'Question type must be one of: multiple-choice, text, boolean, rating',
        'any.required': 'Question type is required'
    }),
    options: Joi.array().items(Joi.string()).when('type', {
        is: 'multiple-choice',
        then: Joi.array().min(2).required().messages({
            'array.min': 'Multiple-choice questions must have at least 2 options',
            'any.required': 'Options are required for multiple-choice questions'
        }),
        otherwise: Joi.array().optional()
    }),
    scoring: Joi.number().min(0).max(100).required().messages({
        'number.min': 'Scoring must be a positive number',
        'number.max': 'Scoring cannot exceed 100',
        'any.required': 'Question scoring is required'
    })
});

// Create job validation schema
const createJobSchema = Joi.object({
    title: Joi.string().max(200).required().messages({
        'string.empty': 'Job title is required',
        'string.max': 'Job title cannot exceed 200 characters',
        'any.required': 'Job title is required'
    }),
    location: Joi.string().max(100).required().messages({
        'string.empty': 'Job location is required',
        'string.max': 'Location cannot exceed 100 characters',
        'any.required': 'Job location is required'
    }),
    customer: Joi.string().max(100).required().messages({
        'string.empty': 'Customer is required',
        'string.max': 'Customer name cannot exceed 100 characters',
        'any.required': 'Customer is required'
    }),
    jobName: Joi.string().max(150).required().messages({
        'string.empty': 'Job name is required',
        'string.max': 'Job name cannot exceed 150 characters',
        'any.required': 'Job name is required'
    }),
    description: Joi.string().max(2000).required().messages({
        'string.empty': 'Job description is required',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Job description is required'
    }),
    questions: Joi.array().items(questionSchema).min(1).required().messages({
        'array.min': 'At least one question is required',
        'any.required': 'Questions are required'
    })
});

// Update job validation schema (all fields optional)
const updateJobSchema = Joi.object({
    title: Joi.string().max(200).optional().messages({
        'string.empty': 'Job title cannot be empty',
        'string.max': 'Job title cannot exceed 200 characters'
    }),
    location: Joi.string().max(100).optional().messages({
        'string.empty': 'Job location cannot be empty',
        'string.max': 'Location cannot exceed 100 characters'
    }),
    customer: Joi.string().max(100).optional().messages({
        'string.empty': 'Customer cannot be empty',
        'string.max': 'Customer name cannot exceed 100 characters'
    }),
    jobName: Joi.string().max(150).optional().messages({
        'string.empty': 'Job name cannot be empty',
        'string.max': 'Job name cannot exceed 150 characters'
    }),
    description: Joi.string().max(2000).optional().messages({
        'string.empty': 'Job description cannot be empty',
        'string.max': 'Description cannot exceed 2000 characters'
    }),
    questions: Joi.array().items(questionSchema).min(1).optional().messages({
        'array.min': 'At least one question is required'
    })
});

// Parameter validation schema
const jobIdParamSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'string.empty': 'Job ID is required',
        'any.required': 'Job ID is required'
    })
});

// Validation middleware for creating jobs
export const validateCreateJob = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = createJobSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const validationErrors = error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: validationErrors
        });
        return;
    }

    next();
};

// Validation middleware for updating jobs
export const validateUpdateJob = (req: Request, res: Response, next: NextFunction): void => {
    // Validate params
    const paramValidation = jobIdParamSchema.validate(req.params);
    const bodyValidation = updateJobSchema.validate(req.body, { abortEarly: false });

    if (paramValidation.error) {
        const validationErrors = paramValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Parameter validation error',
            errors: validationErrors
        });
        return;
    }

    if (bodyValidation.error) {
        const validationErrors = bodyValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Body validation error',
            errors: validationErrors
        });
        return;
    }

    next();
};

// Validation middleware for job ID parameters
export const validateJobIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = jobIdParamSchema.validate(req.params);

    if (error) {
        const validationErrors = error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Parameter validation error',
            errors: validationErrors
        });
        return;
    }

    next();
};

export { createJobSchema, updateJobSchema, jobIdParamSchema };