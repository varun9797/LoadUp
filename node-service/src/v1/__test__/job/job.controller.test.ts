import { Request, Response } from 'express';
import jobController from '../../components/job/job.controller';
import jobService from '../../components/job/job.service';

// Mock the job service
jest.mock('../../components/job/job.service');
const mockedJobService = jobService as jest.Mocked<typeof jobService>;

describe('JobController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();

    mockResponse = {
      status: responseStatus,
      json: responseJson
    };

    mockRequest = {
      body: {},
      params: {}
    };

    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a job successfully', async () => {
      const jobData = {
        title: 'Software Engineer',
        location: 'San Francisco',
        customer: 'TechCorp',
        jobName: 'Backend Developer',
        description: 'Great opportunity',
        questions: [
          {
            id: 'q1',
            text: 'What is your experience?',
            type: 'text',
            scoring: 10
          }
        ]
      };

      const createdJob = {
        _id: 'job123',
        ...jobData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.body = jobData;
      mockedJobService.createJob.mockResolvedValue(createdJob as any);

      await jobController.createJob(mockRequest as Request, mockResponse as Response);

      expect(mockedJobService.createJob).toHaveBeenCalledWith(jobData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Job created successfully',
        data: createdJob
      });
    });

    it('should handle validation errors', async () => {
      const error = {
        name: 'ValidationError',
        errors: {
          title: { message: 'Title is required' },
          location: { message: 'Location is required' }
        }
      };

      mockRequest.body = {};
      mockedJobService.createJob.mockRejectedValue(error);

      await jobController.createJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: ['Title is required', 'Location is required']
      });
    });

    it('should handle internal server errors', async () => {
      mockRequest.body = {
        title: 'Software Engineer'
      };
      mockedJobService.createJob.mockRejectedValue(new Error('Database connection failed'));

      await jobController.createJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs successfully', async () => {
      const jobs = [
        {
          _id: 'job1',
          title: 'Job 1',
          location: 'Location 1'
        },
        {
          _id: 'job2',
          title: 'Job 2',
          location: 'Location 2'
        }
      ];

      mockedJobService.getAllJobs.mockResolvedValue(jobs as any);

      await jobController.getAllJobs(mockRequest as Request, mockResponse as Response);

      expect(mockedJobService.getAllJobs).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Jobs retrieved successfully',
        data: jobs,
        count: jobs.length
      });
    });

    it('should handle errors when fetching jobs', async () => {
      mockedJobService.getAllJobs.mockRejectedValue(new Error('Database error'));

      await jobController.getAllJobs(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getJobById', () => {
    it('should return a job when found', async () => {
      const jobId = 'job123';
      const job = {
        _id: jobId,
        title: 'Software Engineer',
        location: 'San Francisco'
      };

      mockRequest.params = { jobId };
      mockedJobService.getJobById.mockResolvedValue(job as any);

      await jobController.getJobById(mockRequest as Request, mockResponse as Response);

      expect(mockedJobService.getJobById).toHaveBeenCalledWith(jobId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Job retrieved successfully',
        data: job
      });
    });

    it('should return 404 when job not found', async () => {
      const jobId = 'nonexistent';

      mockRequest.params = { jobId };
      mockedJobService.getJobById.mockResolvedValue(null);

      await jobController.getJobById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Job not found'
      });
    });

    it('should handle CastError for invalid ObjectId', async () => {
      const jobId = 'invalid-id';
      const error = { name: 'CastError' };

      mockRequest.params = { jobId };
      mockedJobService.getJobById.mockRejectedValue(error);

      await jobController.getJobById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid ID format'
      });
    });
  });

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const jobId = 'job123';
      const updateData = { title: 'Updated Title' };
      const updatedJob = {
        _id: jobId,
        title: 'Updated Title',
        location: 'San Francisco'
      };

      mockRequest.params = { jobId };
      mockRequest.body = updateData;
      mockedJobService.updateJob.mockResolvedValue(updatedJob as any);

      await jobController.updateJob(mockRequest as Request, mockResponse as Response);

      expect(mockedJobService.updateJob).toHaveBeenCalledWith(jobId, updateData);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Job updated successfully',
        data: updatedJob
      });
    });

    it('should return 404 when job to update not found', async () => {
      const jobId = 'nonexistent';
      const updateData = { title: 'Updated Title' };

      mockRequest.params = { jobId };
      mockRequest.body = updateData;
      mockedJobService.updateJob.mockResolvedValue(null);

      await jobController.updateJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Job not found'
      });
    });
  });

  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      const jobId = 'job123';

      mockRequest.params = { jobId };
      mockedJobService.deleteJob.mockResolvedValue(true);

      await jobController.deleteJob(mockRequest as Request, mockResponse as Response);

      expect(mockedJobService.deleteJob).toHaveBeenCalledWith(jobId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Job deleted successfully',
        data: null
      });
    });

    it('should return 404 when job to delete not found', async () => {
      const jobId = 'nonexistent';

      mockRequest.params = { jobId };
      mockedJobService.deleteJob.mockResolvedValue(false);

      await jobController.deleteJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Job not found'
      });
    });
  });
});
