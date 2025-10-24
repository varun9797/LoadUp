import jobService from '../../components/job/job.service';
import { Job } from '../../components/job/job.model';

// Mock the Job model
jest.mock('../../components/job/job.model');
const MockedJob = Job as jest.Mocked<typeof Job>;

describe('JobService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
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
            type: 'text' as const,
            scoring: 10
          }
        ]
      };

      const savedJob = {
        _id: 'job123',
        ...jobData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockJobInstance = {
        save: jest.fn().mockResolvedValue(savedJob)
      };

      (MockedJob as any).mockImplementation(() => mockJobInstance);

      const result = await jobService.createJob(jobData);

      expect(MockedJob).toHaveBeenCalledWith(jobData);
      expect(mockJobInstance.save).toHaveBeenCalled();
      expect(result).toEqual(savedJob);
    });

    it('should throw an error when job creation fails', async () => {
      const jobData = {
        title: 'Software Engineer',
        location: 'San Francisco',
        customer: 'TechCorp',
        jobName: 'Backend Developer',
        description: 'Great opportunity',
        questions: []
      };

      const mockJobInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (MockedJob as any).mockImplementation(() => mockJobInstance);

      await expect(jobService.createJob(jobData)).rejects.toThrow('Database error');
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs sorted by creation date', async () => {
      const mockJobs = [
        {
          _id: 'job1',
          title: 'Job 1',
          createdAt: new Date('2023-01-02')
        },
        {
          _id: 'job2',
          title: 'Job 2',
          createdAt: new Date('2023-01-01')
        }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockJobs);
      MockedJob.find = jest.fn().mockReturnValue({ sort: mockSort });

      const result = await jobService.getAllJobs();

      expect(MockedJob.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockJobs);
    });

    it('should throw an error when fetching jobs fails', async () => {
      const mockSort = jest.fn().mockRejectedValue(new Error('Database error'));
      MockedJob.find = jest.fn().mockReturnValue({ sort: mockSort });

      await expect(jobService.getAllJobs()).rejects.toThrow('Database error');
    });
  });

  describe('getJobById', () => {
    it('should return a job when found', async () => {
      const jobId = 'job123';
      const mockJob = {
        _id: jobId,
        title: 'Software Engineer'
      };

      MockedJob.findById = jest.fn().mockResolvedValue(mockJob);

      const result = await jobService.getJobById(jobId);

      expect(MockedJob.findById).toHaveBeenCalledWith(jobId);
      expect(result).toEqual(mockJob);
    });

    it('should return null when job not found', async () => {
      const jobId = 'nonexistent';

      MockedJob.findById = jest.fn().mockResolvedValue(null);

      const result = await jobService.getJobById(jobId);

      expect(MockedJob.findById).toHaveBeenCalledWith(jobId);
      expect(result).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      const jobId = 'job123';

      MockedJob.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(jobService.getJobById(jobId)).rejects.toThrow('Database error');
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

      MockedJob.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedJob);

      const result = await jobService.updateJob(jobId, updateData);

      expect(MockedJob.findByIdAndUpdate).toHaveBeenCalledWith(
        jobId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedJob);
    });

    it('should return null when job to update is not found', async () => {
      const jobId = 'nonexistent';
      const updateData = { title: 'Updated Title' };

      MockedJob.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await jobService.updateJob(jobId, updateData);

      expect(result).toBeNull();
    });

    it('should throw an error when update fails', async () => {
      const jobId = 'job123';
      const updateData = { title: 'Updated Title' };

      MockedJob.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(jobService.updateJob(jobId, updateData)).rejects.toThrow('Database error');
    });
  });

  describe('deleteJob', () => {
    it('should delete a job successfully', async () => {
      const jobId = 'job123';
      const deletedJob = { _id: jobId, title: 'Deleted Job' };

      MockedJob.findByIdAndDelete = jest.fn().mockResolvedValue(deletedJob);

      const result = await jobService.deleteJob(jobId);

      expect(MockedJob.findByIdAndDelete).toHaveBeenCalledWith(jobId);
      expect(result).toBe(true);
    });

    it('should return false when job to delete is not found', async () => {
      const jobId = 'nonexistent';

      MockedJob.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const result = await jobService.deleteJob(jobId);

      expect(result).toBe(false);
    });

    it('should throw an error when deletion fails', async () => {
      const jobId = 'job123';

      MockedJob.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(jobService.deleteJob(jobId)).rejects.toThrow('Database error');
    });
  });
});
