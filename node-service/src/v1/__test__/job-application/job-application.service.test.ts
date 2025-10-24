import jobApplicationService from '../../components/job-application/job-application.service';
import { JobApplication } from '../../components/job-application/job-application.model';
import { Job } from '../../components/job/job.model';

// Mock the models
jest.mock('../../components/job-application/job-application.model');
jest.mock('../../components/job/job.model');

const MockedJobApplication = JobApplication as jest.Mocked<typeof JobApplication>;
const MockedJob = Job as jest.Mocked<typeof Job>;

describe('JobApplicationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyForJob', () => {
    const mockApplicationData = {
      jobId: 'job123',
      applicantId: 'applicant1',
      applicantName: 'John Doe',
      applicantEmail: 'john@example.com',
      answers: [
        {
          questionId: 'q1',
          answer: 'Advanced'
        },
        {
          questionId: 'q2',
          answer: 'I have 5 years of experience...'
        }
      ]
    };

    const mockJob = {
      _id: 'job123',
      title: 'Software Engineer',
      questions: [
        {
          id: 'q1',
          text: 'Experience level?',
          type: 'multiple-choice',
          scoring: 25
        },
        {
          id: 'q2',
          text: 'Describe your experience',
          type: 'text',
          scoring: 30
        }
      ]
    };

    it('should create a job application successfully', async () => {
      MockedJob.findById = jest.fn().mockResolvedValue(mockJob);
      MockedJobApplication.findOne = jest.fn().mockResolvedValue(null);

      const savedApplication = {
        _id: 'app123',
        ...mockApplicationData,
        totalScore: 55,
        maxPossibleScore: 55,
        scorePercentage: 100
      };

      const mockApplicationInstance = {
        save: jest.fn().mockResolvedValue(savedApplication)
      };

      (MockedJobApplication as any).mockImplementation(() => mockApplicationInstance);

      const result = await jobApplicationService.applyForJob(mockApplicationData);

      expect(MockedJob.findById).toHaveBeenCalledWith('job123');
      expect(MockedJobApplication.findOne).toHaveBeenCalledWith({
        jobId: 'job123',
        applicantId: 'applicant1'
      });
      expect(result).toEqual(savedApplication);
    });

    it('should throw error when job not found', async () => {
      MockedJob.findById = jest.fn().mockResolvedValue(null);

      await expect(jobApplicationService.applyForJob(mockApplicationData))
        .rejects.toThrow('Job not found');

      expect(MockedJob.findById).toHaveBeenCalledWith('job123');
    });

    it('should throw error when applicant already applied', async () => {
      const existingApplication = {
        _id: 'existing123',
        jobId: 'job123',
        applicantId: 'applicant1'
      };

      MockedJob.findById = jest.fn().mockResolvedValue(mockJob);
      MockedJobApplication.findOne = jest.fn().mockResolvedValue(existingApplication as any);

      await expect(jobApplicationService.applyForJob(mockApplicationData))
        .rejects.toThrow('You have already applied for this job');
    });

    it('should handle database errors', async () => {
      MockedJob.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(jobApplicationService.applyForJob(mockApplicationData))
        .rejects.toThrow('Database error');
    });
  });

  describe('getApplicationsByJob', () => {
    it('should return applications sorted by score and date', async () => {
      const mockApplications = [
        {
          _id: 'app1',
          scorePercentage: 90,
          appliedAt: new Date('2023-01-01')
        },
        {
          _id: 'app2',
          scorePercentage: 85,
          appliedAt: new Date('2023-01-02')
        }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockApplications);
      MockedJobApplication.find = jest.fn().mockReturnValue({ sort: mockSort });

      const result = await jobApplicationService.getApplicationsByJob('job123');

      expect(MockedJobApplication.find).toHaveBeenCalledWith({ jobId: 'job123' });
      expect(mockSort).toHaveBeenCalledWith({ scorePercentage: -1, appliedAt: 1 });
      expect(result).toEqual(mockApplications);
    });

    it('should handle errors when fetching applications', async () => {
      const mockSort = jest.fn().mockRejectedValue(new Error('Database error'));
      MockedJobApplication.find = jest.fn().mockReturnValue({ sort: mockSort });

      await expect(jobApplicationService.getApplicationsByJob('job123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('getApplicationById', () => {
    it('should return application with populated job details', async () => {
      const mockApplication = {
        _id: 'app123',
        jobId: 'job123',
        applicantName: 'John Doe'
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockApplication);
      MockedJobApplication.findById = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await jobApplicationService.getApplicationById('app123');

      expect(MockedJobApplication.findById).toHaveBeenCalledWith('app123');
      expect(mockPopulate).toHaveBeenCalledWith('jobId');
      expect(result).toEqual(mockApplication);
    });

    it('should return null when application not found', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      MockedJobApplication.findById = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await jobApplicationService.getApplicationById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status successfully', async () => {
      const mockApplication = {
        _id: 'app123',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      MockedJobApplication.findById = jest.fn().mockResolvedValue(mockApplication as any);

      const result = await jobApplicationService.updateApplicationStatus(
        'app123',
        'accepted',
        'hr@company.com',
        'Great candidate'
      );

      expect(MockedJobApplication.findById).toHaveBeenCalledWith('app123');
      expect(mockApplication.status).toBe('accepted');
      expect(mockApplication.save).toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });

    it('should throw error when application not found', async () => {
      MockedJobApplication.findById = jest.fn().mockResolvedValue(null);

      await expect(jobApplicationService.updateApplicationStatus(
        'nonexistent',
        'accepted'
      )).rejects.toThrow('Application not found');
    });
  });

  describe('getTopApplicants', () => {
    it('should return top applicants with limit', async () => {
      const mockApplicants = [
        {
          _id: 'app1',
          scorePercentage: 95
        },
        {
          _id: 'app2',
          scorePercentage: 90
        }
      ];

      const mockLimit = jest.fn().mockResolvedValue(mockApplicants);
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      MockedJobApplication.find = jest.fn().mockReturnValue({ sort: mockSort });

      const result = await jobApplicationService.getTopApplicants('job123', 5);

      expect(MockedJobApplication.find).toHaveBeenCalledWith({ jobId: 'job123' });
      expect(mockSort).toHaveBeenCalledWith({ scorePercentage: -1, appliedAt: 1 });
      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockApplicants);
    });

    it('should use default limit when not specified', async () => {
      const mockApplicants: any[] = [];
      const mockLimit = jest.fn().mockResolvedValue(mockApplicants);
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      MockedJobApplication.find = jest.fn().mockReturnValue({ sort: mockSort });

      await jobApplicationService.getTopApplicants('job123');

      expect(mockLimit).toHaveBeenCalledWith(10);
    });
  });
});
