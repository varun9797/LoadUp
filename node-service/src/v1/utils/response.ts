import { Response } from 'express';
import logger from '../../config/logger';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
    count?: number;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class ResponseHandler {
    /**
     * Send a success response
     */
    static success<T>(
        res: Response,
        data?: T,
        message?: string,
        statusCode: number = 200,
        count?: number
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            message: message || 'Success',
            data
        };

        if (count !== undefined) {
            response.count = count;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Send a created response (201)
     */
    static created<T>(
        res: Response,
        data: T,
        message: string = 'Resource created successfully'
    ): Response {
        return ResponseHandler.success(res, data, message, 201);
    }

    /**
     * Send an error response
     */
    static error(
        res: Response,
        message: string = 'Internal server error',
        statusCode: number = 500,
        errors?: string[]
    ): Response {
        const response: ApiResponse = {
            success: false,
            message
        };

        if (errors && errors.length > 0) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Send a validation error response (400)
     */
    static validationError(
        res: Response,
        errors: string[],
        message: string = 'Validation error'
    ): Response {
        return ResponseHandler.error(res, message, 400, errors);
    }

    /**
     * Send a not found response (404)
     */
    static notFound(
        res: Response,
        message: string = 'Resource not found'
    ): Response {
        return ResponseHandler.error(res, message, 404);
    }

    /**
     * Send an unauthorized response (401)
     */
    static unauthorized(
        res: Response,
        message: string = 'Unauthorized access'
    ): Response {
        return ResponseHandler.error(res, message, 401);
    }

    /**
     * Send a forbidden response (403)
     */
    static forbidden(
        res: Response,
        message: string = 'Access forbidden'
    ): Response {
        return ResponseHandler.error(res, message, 403);
    }

    /**
     * Send a conflict response (409)
     */
    static conflict(
        res: Response,
        message: string = 'Resource conflict'
    ): Response {
        return ResponseHandler.error(res, message, 409);
    }

    /**
     * Send a bad request response (400)
     */
    static badRequest(
        res: Response,
        message: string = 'Bad request'
    ): Response {
        return ResponseHandler.error(res, message, 400);
    }

    /**
     * Send a paginated response
     */
    static paginated<T>(
        res: Response,
        data: T[],
        page: number,
        limit: number,
        total: number,
        message: string = 'Data retrieved successfully'
    ): Response {
        const totalPages = Math.ceil(total / limit);

        const response: ApiResponse<T[]> = {
            success: true,
            message,
            data,
            count: data.length,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };

        return res.status(200).json(response);
    }

    /**
     * Handle Mongoose validation errors
     */
    static handleValidationError(error: any): string[] {
        const errors: string[] = [];

        if (error.name === 'ValidationError') {
            Object.values(error.errors).forEach((err: any) => {
                errors.push(err.message);
            });
        } else if (error.name === 'CastError') {
            errors.push('Invalid ID format');
        } else if (error.code === 11000) {
            // MongoDB duplicate key error
            const field = Object.keys(error.keyValue)[0];
            errors.push(`${field} already exists`);
        } else {
            errors.push(error.message || 'Unknown error occurred');
        }

        return errors;
    }

    /**
     * Handle async controller errors
     */
    static handleAsyncError(error: any, res: Response): Response {

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = ResponseHandler.handleValidationError(error);
            return ResponseHandler.validationError(res, errors);
        }

        // Handle cast errors (invalid MongoDB ObjectId)
        if (error.name === 'CastError') {
            return ResponseHandler.badRequest(res, 'Invalid ID format');
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return ResponseHandler.conflict(res, `${field} already exists`);
        }

        // Handle business logic errors
        if (error.message === 'Job not found') {
            return ResponseHandler.notFound(res, error.message);
        }

        if (error.message === 'You have already applied for this job') {
            return ResponseHandler.conflict(res, error.message);
        }

        if (error.message === 'Invalid answer type') {
            return ResponseHandler.badRequest(res, error.message);
        }

        if (error.message === 'Question not found for the given answer') {
            return ResponseHandler.badRequest(res, error.message);
        }

        logger.error('Unhandled error:', error);

        // Handle generic errors
        return ResponseHandler.error(res, 'Internal server error');
    }
}

export default ResponseHandler;
