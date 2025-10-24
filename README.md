# 💼 Job Management & Application System

A job posting and application management system built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**. Features comprehensive job CRUD operations, job application management with automatic scoring, and robust validation using Joi.

---

## 🧱 Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Validation**: Joi
- **DevOps**: Docker, Docker Compose
- **Architecture**: MVC with Service Layer

---

## 📦 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Postman](https://www.postman.com/) or similar API testing tool

---

## 🚀 How to Run the Project

Run the below command to build and run the app using Docker:

```bash
npm start
```

The API server will be available at: **http://localhost:3000**

---

## 📋 API Endpoints

### 🏢 Job Management

#### Create a New Job
```http
POST http://localhost:3000/api/v1/jobs
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "customer": "TechCorp Inc",
  "jobName": "Backend Developer - Node.js",
  "description": "We are seeking a highly skilled Senior Software Engineer...",
  "questions": [
    {
      "id": "q1",
      "text": "What is your experience level with Node.js?",
      "type": "multiple-choice",
      "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
      "scoring": 25
    },
    {
      "id": "q2",
      "text": "Describe your experience with microservices architecture.",
      "type": "text",
      "scoring": 30
    }
  ]
}
```

#### Get All Jobs
```http
GET http://localhost:3000/api/v1/jobs
```

#### Get Job by ID
```http
GET http://localhost:3000/api/v1/jobs/{jobId}
```

#### Update Job
```http
PUT http://localhost:3000/api/v1/jobs/{jobId}
Content-Type: application/json

{
  "title": "Updated Job Title",
  "location": "Remote"
}
```

#### Delete Job
```http
DELETE http://localhost:3000/api/v1/jobs/{jobId}
```

### 👤 Job Applications

#### Apply for a Job
```http
POST http://localhost:3000/api/v1/job-applications/apply
Content-Type: application/json

{
  "jobId": "670f123456789abcdef12345",
  "applicantId": "applicant_001",
  "applicantName": "John Doe",
  "applicantEmail": "john.doe@email.com",
  "answers": [
    {
      "questionId": "q1",
      "answer": "Advanced"
    },
    {
      "questionId": "q2",
      "answer": "I have extensive experience with microservices..."
    }
  ]
}
```

#### Get Application by ID
```http
GET http://localhost:3000/api/v1/job-applications/{applicationId}
```

#### Get All Applications for a Job
```http
GET http://localhost:3000/api/v1/job-applications/job/{jobId}
```

#### Update Application Status
```http
PUT http://localhost:3000/api/v1/job-applications/{applicationId}/status
Content-Type: application/json

{
  "status": "accepted",
  "reviewedBy": "hr@company.com",
  "notes": "Excellent candidate with strong technical skills."
}
```

#### Get Top Applicants
```http
GET http://localhost:3000/api/v1/job-applications/job/{jobId}/top?limit=5
```

---

## 🧪 Test Payloads

### Sample Job Creation
```json
{
  "title": "Full Stack Developer",
  "location": "Austin, TX",
  "customer": "StartupXYZ",
  "jobName": "MERN Stack Developer",
  "description": "We're looking for a versatile Full Stack Developer to work on our web applications using the MERN stack.",
  "questions": [
    {
      "id": "q1",
      "text": "Which databases have you worked with?",
      "type": "multiple-choice",
      "options": ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
      "scoring": 20
    },
    {
      "id": "q2",
      "text": "Describe a challenging bug you encountered and how you solved it.",
      "type": "text",
      "scoring": 30
    },
    {
      "id": "q3",
      "text": "How comfortable are you with DevOps practices? (1-10)",
      "type": "rating",
      "scoring": 25
    },
    {
      "id": "q4",
      "text": "Do you have experience with REST API development?",
      "type": "boolean",
      "scoring": 25
    }
  ]
}
```

### Sample Job Application
```json
{
  "jobId": "670f123456789abcdef12345",
  "applicantId": "applicant_002",
  "applicantName": "Sarah Smith",
  "applicantEmail": "sarah.smith@gmail.com",
  "answers": [
    {
      "questionId": "q1",
      "answer": ["MongoDB", "PostgreSQL"]
    },
    {
      "questionId": "q2",
      "answer": "I once encountered a memory leak in our Node.js application. I used profiling tools to identify the issue was in our caching mechanism where objects weren't being properly garbage collected. I implemented a TTL-based cache cleanup that resolved the issue."
    },
    {
      "questionId": "q3",
      "answer": 7
    },
    {
      "questionId": "q4",
      "answer": true
    }
  ]
}
```

---

## 🎯 Features

- **Complete Job CRUD Operations**
- **Automated Application Scoring System**
- **Input Validation with Joi**
- **Duplicate Application Prevention**
- **Comprehensive Error Handling**
- **RESTful API Design**
- **MongoDB Integration with Mongoose**
- **TypeScript Support**
- **Docker Containerization**

---

## 🏗️ Architecture

```
├── src/
│   ├── app.ts                     # Express app setup
│   ├── config/
│   │   └── mongoClient.ts         # MongoDB connection
│   └── v1/
│       ├── components/
│       │   ├── job/
│       │   │   ├── job.model.ts      # Job schema & model
│       │   │   ├── job.service.ts    # Business logic
│       │   │   ├── job.controller.ts # HTTP handlers
│       │   │   ├── job.validator.ts  # Joi validation
│       │   │   └── job.router.ts     # Route definitions
│       │   └── job-application/
│       │       ├── job-application.model.ts
│       │       ├── job-application.service.ts
│       │       ├── job-application.controller.ts
│       │       ├── job-application.validator.ts
│       │       └── job-application.router.ts
│       └── routes/
│           ├── private.ts         # Protected routes
│           └── public.ts          # Public routes
```

---

## 📊 Scoring System

The application automatically calculates scores based on question types:
- **Multiple Choice**: Full points if answered
- **Text**: Points based on answer length and quality
- **Boolean**: Full points if answered
- **Rating**: Proportional points based on rating value

---

## 🔧 Development

To run in development mode:
```bash
cd node-service
npm run dev
```

## 🚀 Production

The system is containerized and production-ready with proper error handling, validation, and logging.

---

## 📝 License

This project is for educational and development purposes.

---

## 🙏 THANK YOU!

