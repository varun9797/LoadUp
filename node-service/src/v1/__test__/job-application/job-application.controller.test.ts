import { Request, Response } from 'express';
import jobApplicationController from '../../components/job-application/job-application.controller';
import jobApplicationService from '../../components/job-application/job-application.service';

// Mock the job application service
jest.mock('../../components/job-application/job-application.service');
const mockedJobApplicationService = jobApplicationService as jest.Mocked<typeof jobApplicationService>;

describe('JobApplicationController', () => {
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
      params: {},
      query: {}
    };

    jest.clearAllMocks();
  });

  describe('applyForJob', () => {
    const applicationData = {
      jobId: 'job123',
      applicantId: 'applicant1',
      applicantName: 'John Doe',
      applicantEmail: 'john@example.com',
      answers: [
        {
          questionId: 'q1',
          answer: 'Advanced'
        }
      ]
    };

    it('should create job application successfully', async () => {
      const createdApplication = {
        _id: 'app123',
        ...applicationData,
        totalScore: 85,
        maxPossibleScore: 100,
        scorePercentage: 85,
        status: 'pending',
        appliedAt: new Date()
      };

      mockRequest.body = applicationData;
      mockedJobApplicationService.applyForJob.mockResolvedValue(createdApplication as any);

      await jobApplicationController.applyForJob(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.applyForJob).toHaveBeenCalledWith(applicationData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Application submitted successfully',
        data: {
          applicationId: 'app123',
          totalScore: 85,
          maxPossibleScore: 100,
          scorePercentage: 85,
          status: 'pending',
          appliedAt: createdApplication.appliedAt
        }
      });
    });

    it('should handle job not found error', async () => {
      mockRequest.body = applicationData;
      mockedJobApplicationService.applyForJob.mockRejectedValue(new Error('Job not found'));

      await jobApplicationController.applyForJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Job not found'
      });
    });

    it('should handle duplicate application error', async () => {
      mockRequest.body = applicationData;
      mockedJobApplicationService.applyForJob.mockRejectedValue(
        new Error('You have already applied for this job')
      );

      await jobApplicationController.applyForJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'You have already applied for this job'
      });
    });

    it('should handle validation errors', async () => {
      const validationError = {
        name: 'ValidationError',
        errors: {
          applicantEmail: { message: 'Valid email is required' },
          answers: { message: 'At least one answer is required' }
        }
      };

      mockRequest.body = { ...applicationData, applicantEmail: 'invalid-email' };
      mockedJobApplicationService.applyForJob.mockRejectedValue(validationError);

      await jobApplicationController.applyForJob(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: ['Valid email is required', 'At least one answer is required']
      });
    });
  });

  describe('getApplication', () => {
    it('should return application when found', async () => {
      const applicationId = 'app123';
      const application = {
        _id: applicationId,
        applicantName: 'John Doe',
        totalScore: 85
      };

      mockRequest.params = { applicationId };
      mockedJobApplicationService.getApplicationById.mockResolvedValue(application as any);

      await jobApplicationController.getApplication(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.getApplicationById).toHaveBeenCalledWith(applicationId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: "Success",
        data: application
      });
    });

    it('should return 404 when application not found', async () => {
      const applicationId = 'nonexistent';

      mockRequest.params = { applicationId };
      mockedJobApplicationService.getApplicationById.mockResolvedValue(null);

      await jobApplicationController.getApplication(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Application not found'
      });
    });

    it('should handle server errors', async () => {
      const applicationId = 'app123';

      mockRequest.params = { applicationId };
      mockedJobApplicationService.getApplicationById.mockRejectedValue(new Error('Database error'));

      await jobApplicationController.getApplication(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getJobApplications', () => {
    it('should return all applications for a job', async () => {
      const jobId = 'job123';
      const applications = [
        {
          _id: 'app1',
          applicantName: 'John Doe',
          scorePercentage: 85
        },
        {
          _id: 'app2',
          applicantName: 'Jane Smith',
          scorePercentage: 92
        }
      ];

      mockRequest.params = { jobId };
      mockedJobApplicationService.getApplicationsByJob.mockResolvedValue(applications as any);

      await jobApplicationController.getJobApplications(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.getApplicationsByJob).toHaveBeenCalledWith(jobId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: "Applications retrieved successfully",
        data: applications,
        count: applications.length
      });
    });

    it('should handle errors when fetching applications', async () => {
      const jobId = 'job123';

      mockRequest.params = { jobId };
      mockedJobApplicationService.getApplicationsByJob.mockRejectedValue(new Error('Database error'));

      await jobApplicationController.getJobApplications(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status successfully', async () => {
      const applicationId = 'app123';
      const updateData = {
        status: 'accepted',
        reviewedBy: 'hr@company.com',
        notes: 'Great candidate'
      };

      const updatedApplication = {
        _id: applicationId,
        status: 'accepted',
        reviewedBy: 'hr@company.com',
        notes: 'Great candidate'
      };

      mockRequest.params = { applicationId };
      mockRequest.body = updateData;
      mockedJobApplicationService.updateApplicationStatus.mockResolvedValue(updatedApplication as any);

      await jobApplicationController.updateApplicationStatus(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.updateApplicationStatus).toHaveBeenCalledWith(
        applicationId,
        'accepted',
        'hr@company.com',
        'Great candidate'
      );
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Application status updated successfully',
        data: updatedApplication
      });
    });

    it('should return 404 when application not found', async () => {
      const applicationId = 'nonexistent';
      const updateData = { status: 'accepted' };

      mockRequest.params = { applicationId };
      mockRequest.body = updateData;
      mockedJobApplicationService.updateApplicationStatus.mockResolvedValue(null);

      await jobApplicationController.updateApplicationStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Application not found'
      });
    });
  });

  describe('getTopApplicants', () => {
    it('should return top applicants with specified limit', async () => {
      const jobId = 'job123';
      const limit = '5';
      const topApplicants = [
        {
          _id: 'app1',
          applicantName: 'John Doe',
          scorePercentage: 95
        },
        {
          _id: 'app2',
          applicantName: 'Jane Smith',
          scorePercentage: 90
        }
      ];

      mockRequest.params = { jobId };
      mockRequest.query = { limit };
      mockedJobApplicationService.getTopApplicants.mockResolvedValue(topApplicants as any);

      await jobApplicationController.getTopApplicants(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.getTopApplicants).toHaveBeenCalledWith(jobId, 5);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: "Top applicants retrieved successfully",
        data: topApplicants,
        count: topApplicants.length
      });
    });

    it('should use default limit when not specified', async () => {
      const jobId = 'job123';

      mockRequest.params = { jobId };
      mockRequest.query = {};
      mockedJobApplicationService.getTopApplicants.mockResolvedValue([] as any);

      await jobApplicationController.getTopApplicants(mockRequest as Request, mockResponse as Response);

      expect(mockedJobApplicationService.getTopApplicants).toHaveBeenCalledWith(jobId, 10);
    });
  });
});
