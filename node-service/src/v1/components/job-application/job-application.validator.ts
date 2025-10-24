import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Answer validation schema
const answerSchema = Joi.object({
    questionId: Joi.string().required().messages({
        'string.empty': 'Question ID is required',
        'any.required': 'Question ID is required'
    }),
    answer: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string()),
        Joi.number(),
        Joi.boolean()
    ).required().messages({
        'any.required': 'Answer is required',
        'alternatives.match': 'Answer must be a string, number, boolean, or array of strings'
    })
});

// Apply for job validation schema
const applyForJobSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'string.empty': 'Job ID is required',
        'any.required': 'Job ID is required'
    }),
    applicantId: Joi.string().required().messages({
        'string.empty': 'Applicant ID is required',
        'any.required': 'Applicant ID is required'
    }),
    applicantName: Joi.string().max(100).required().messages({
        'string.empty': 'Applicant name is required',
        'string.max': 'Applicant name cannot exceed 100 characters',
        'any.required': 'Applicant name is required'
    }),
    applicantEmail: Joi.string().email().required().messages({
        'string.empty': 'Applicant email is required',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Applicant email is required'
    }),
    answers: Joi.array().items(answerSchema).min(1).required().messages({
        'array.min': 'At least one answer is required',
        'any.required': 'Answers are required'
    })
});

// Update application status validation schema
const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required().messages({
        'any.only': 'Status must be one of: pending, reviewed, accepted, rejected',
        'any.required': 'Status is required'
    }),
    reviewedBy: Joi.string().optional().messages({
        'string.empty': 'Reviewed by cannot be empty if provided'
    }),
    notes: Joi.string().max(1000).optional().messages({
        'string.max': 'Notes cannot exceed 1000 characters'
    })
});

// Get job applications query validation schema
const getJobApplicationsQuerySchema = Joi.object({
    status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').optional(),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    page: Joi.number().integer().min(1).optional().default(1),
    sortBy: Joi.string().valid('scorePercentage', 'appliedAt', 'applicantName').optional().default('scorePercentage'),
    sortOrder: Joi.string().valid('asc', 'desc').optional().default('desc')
});

// Parameter validation schemas
const applicationIdParamSchema = Joi.object({
    applicationId: Joi.string().required().messages({
        'string.empty': 'Application ID is required',
        'any.required': 'Application ID is required'
    })
});

const jobIdParamSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'string.empty': 'Job ID is required',
        'any.required': 'Job ID is required'
    })
});

// Validation middleware for applying for a job
export const validateApplyForJob = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = applyForJobSchema.validate(req.body, { abortEarly: false });

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

// Validation middleware for updating application status
export const validateUpdateStatus = (req: Request, res: Response, next: NextFunction): void => {
    // Validate both params and body
    const paramValidation = applicationIdParamSchema.validate(req.params);
    const bodyValidation = updateStatusSchema.validate(req.body, { abortEarly: false });

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

// Validation middleware for getting application by ID
export const validateGetApplication = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = applicationIdParamSchema.validate(req.params);

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

// Validation middleware for getting job applications
export const validateGetJobApplications = (req: Request, res: Response, next: NextFunction): void => {
    // Validate params
    const paramValidation = jobIdParamSchema.validate({ ...req.params });

    if (paramValidation.error) {
        const validationErrors = paramValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Parameter validation error',
            errors: validationErrors
        });
        return;
    }

    // Validate query parameters
    const queryValidation = getJobApplicationsQuerySchema.validate(req.query, { abortEarly: false });

    if (queryValidation.error) {
        const validationErrors = queryValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Query parameter validation error',
            errors: validationErrors
        });
        return;
    }

    next();
};

// Validation middleware for getting top applicants
export const validateGetTopApplicants = (req: Request, res: Response, next: NextFunction): void => {
    const paramValidation = jobIdParamSchema.validate(req.params);

    const querySchema = Joi.object({
        limit: Joi.number().integer().min(1).max(50).optional().default(10)
    });

    const queryValidation = querySchema.validate(req.query);

    if (paramValidation.error) {
        const validationErrors = paramValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Parameter validation error',
            errors: validationErrors
        });
        return;
    }

    if (queryValidation.error) {
        const validationErrors = queryValidation.error.details.map(detail => detail.message);
        res.status(400).json({
            success: false,
            message: 'Query parameter validation error',
            errors: validationErrors
        });
        return;
    }

    next();
};

// Export schemas for reuse
export {
    applyForJobSchema,
    updateStatusSchema,
    getJobApplicationsQuerySchema,
    applicationIdParamSchema,
    jobIdParamSchema
};