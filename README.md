# 🚛 Truck Driver Job Management & Hiring System

A comprehensive truck driver job posting and hiring system built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**. Features truck driver job CRUD operations, driver application management with automatic scoring based on correct answers, and robust validation using Joi.

---

## 🧱 Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Validation**: Joi
- **Testing**: Jest
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

### Development Commands

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build TypeScript
npm run build

# Generate sample data (30 driver applications)
npm run seed-db
```

---

## 📋 API Endpoints

### 🚛 Truck Driver Job Management

#### Create a New Truck Driver Job
```http
POST http://localhost:3000/api/v1/jobs
Content-Type: application/json

{
  "title": "Long Haul Truck Driver - OTR",
  "location": "Dallas, TX",
  "customer": "FreightMaster Logistics",
  "jobName": "Over-the-Road Truck Driver",
  "description": "We are seeking experienced long-haul truck drivers for our OTR fleet. Must have clean driving record and be willing to travel nationwide.",
  "questions": [
    {
      "text": "How many years of commercial driving experience do you have?",
      "type": "single-choice",
      "options": ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
      "correctAnswer": "5-10 years",
      "scoring": 25
    },
    {
      "text": "Which types of trucks have you operated?",
      "type": "multiple-choice", 
      "options": ["Class 8 Semi-trucks", "Flatbed trailers", "Refrigerated trucks", "Tanker trucks", "Box trucks"],
      "correctAnswer": ["Class 8 Semi-trucks", "Flatbed trailers"],
      "scoring": 30
    },
    {
      "text": "Describe your experience with long-distance hauling and any challenges you've overcome.",
      "type": "text",
      "correctAnswer": ["long-distance", "hauling", "experience", "challenges", "safety"],
      "scoring": 25
    },
    {
      "text": "Do you have a clean driving record with no major violations in the past 3 years?",
      "type": "boolean",
      "correctAnswer": true,
      "scoring": 20
    }
  ]
}
```

#### Get All Driver Jobs
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
  "title": "Local Delivery Driver - Home Daily",
  "location": "Houston, TX"
}
```

#### Delete Job
```http
DELETE http://localhost:3000/api/v1/jobs/{jobId}
```

### 👤 Driver Applications

#### Apply for a Truck Driver Job
```http
POST http://localhost:3000/api/v1/job-applications/apply
Content-Type: application/json

{
  "jobId": "670f123456789abcdef12345",
  "applicantId": "driver_001",
  "applicantName": "Mike Johnson",
  "applicantEmail": "mike.johnson@email.com",
  "answers": [
    {
      "questionId": "q1",
      "answer": "5-10 years"
    },
    {
      "questionId": "q2", 
      "answer": ["Class 8 Semi-trucks", "Flatbed trailers", "Refrigerated trucks"]
    },
    {
      "questionId": "q3",
      "answer": "I have 8 years of long-distance hauling experience across 48 states. I've handled challenging weather conditions, tight delivery schedules, and maintained perfect safety records. My experience includes managing logbooks, fuel efficiency, and customer relations."
    },
    {
      "questionId": "q4",
      "answer": true
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
  "reviewedBy": "hr@freightmaster.com",
  "notes": "Excellent driving record and extensive OTR experience. Ready for orientation."
}
```

#### Get Top Driver Applicants
```http
GET http://localhost:3000/api/v1/job-applications/job/{jobId}/top?limit=5
```

---

## 🧪 Test Payloads

### Sample Local Delivery Driver Job
```json
{
  "title": "Local Delivery Driver - Home Daily",
  "location": "Phoenix, AZ", 
  "customer": "Southwest Transport Co",
  "jobName": "CDL-A Local Delivery Driver",
  "description": "Join our local delivery team! Home every night, excellent benefits, and competitive pay. Perfect for drivers who want work-life balance.",
  "questions": [
    {
      "text": "Do you have a valid CDL-A license?",
      "type": "boolean",
      "correctAnswer": true,
      "scoring": 30
    },
    {
      "text": "Which endorsements do you currently hold?",
      "type": "multiple-choice",
      "options": ["Hazmat", "Passenger", "School Bus", "Double/Triple", "Tank Vehicle"],
      "correctAnswer": ["Hazmat", "Double/Triple"],
      "scoring": 25
    },
    {
      "text": "How would you rate your knowledge of DOT regulations? (1-10)",
      "type": "rating",
      "scoring": 20
    },
    {
      "text": "Describe your experience with urban driving and customer service.",
      "type": "text",
      "correctAnswer": ["urban", "city", "customer", "service", "delivery"],
      "scoring": 25
    }
  ]
}
```

### Sample Driver Application
```json
{
  "jobId": "670f123456789abcdef12345",
  "applicantId": "driver_002",
  "applicantName": "Sarah Williams", 
  "applicantEmail": "sarah.williams@gmail.com",
  "answers": [
    {
      "questionId": "q1",
      "answer": true
    },
    {
      "questionId": "q2",
      "answer": ["Hazmat", "Double/Triple", "Tank Vehicle"]
    },
    {
      "questionId": "q3",
      "answer": 9
    },
    {
      "questionId": "q4",
      "answer": "I have 6 years of urban delivery experience in Chicago and Detroit. I excel at customer service, maintaining professional relationships with clients, and navigating tight city streets safely. I understand the importance of on-time deliveries and representing the company professionally."
    }
  ]
}
```

---

## 🎯 Features

- **Complete Truck Driver Job CRUD Operations**
- **Intelligent Automated Scoring System for Driver Qualifications**
- **Multiple Question Types Support**:
  - Single Choice (CDL class, experience level)
  - Multiple Choice (endorsements, truck types)
  - Text (driving experience, safety records)
  - Boolean (license validity, clean record)
  - Rating (skills assessment, knowledge level)
- **Input Validation with Joi**
- **Duplicate Application Prevention**
- **Comprehensive Error Handling**
- **RESTful API Design**
- **MongoDB Integration with Mongoose**
- **TypeScript Support**
- **Docker Containerization**
- **Comprehensive Test Suite (Jest)**
- **Driver Data Generation Scripts**

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
│       ├── __test__/              # Test files
│       │   ├── job/
│       │   └── job-application/
│       └── routes/
│           ├── private.ts         # Protected routes
│           └── public.ts          # Public routes
├── scripts/
│   ├── generate-data.js           # Sample driver data generation
│   └── generate-job-applications.ts
```

---

## 📊 Advanced Driver Scoring System

The application features an intelligent scoring system that evaluates driver qualifications based on trucking industry requirements:

### Question Types & Scoring Logic:

#### 🎯 **Single Choice Questions**
- **Experience Level Assessment**
- **CDL Class Verification**
- **Full points** for meeting minimum requirements
```json
{
  "type": "single-choice",
  "options": ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
  "correctAnswer": "5-10 years",
  "scoring": 25
}
```

#### 🎯 **Multiple Choice Questions** 
- **Endorsements & Certifications**
- **Truck Type Experience**
- **Intersection scoring**: Points based on relevant qualifications
```json
{
  "type": "multiple-choice", 
  "options": ["Hazmat", "Passenger", "School Bus", "Double/Triple", "Tank Vehicle"],
  "correctAnswer": ["Hazmat", "Double/Triple"],
  "scoring": 30
}
```

#### 🎯 **Text Questions**
- **Driving Experience Description**
- **Safety Record Details**
- **Keyword matching**: Safety, experience, customer service terms
```json
{
  "type": "text",
  "correctAnswer": ["safety", "experience", "customer", "professional", "delivery"],
  "scoring": 25
}
```

#### 🎯 **Boolean Questions**
- **License Validity**
- **Clean Driving Record**
- **DOT Medical Certification**
```json
{
  "type": "boolean",
  "correctAnswer": true,
  "scoring": 20
}
```

#### 🎯 **Rating Questions**
- **Self-Assessment Skills**
- **DOT Regulation Knowledge**
- **Proportional scoring**: Based on rating level
```json
{
  "type": "rating",
  "scoring": 25
}
```

---

## 🧪 Testing

The project includes comprehensive test suites covering truck driver hiring scenarios:

- **Unit Tests**: Driver qualification validation
- **Integration Tests**: Job posting and application API
- **Mock Testing**: Database operations
- **Error Handling**: CDL validation, experience verification

### Run Tests:
```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Coverage:
- ✅ Driver job CRUD operations
- ✅ Application submission with qualification scoring
- ✅ CDL and endorsement validation
- ✅ Experience level assessment
- ✅ Safety record verification

---

## 🔧 Development

### Local Development:
```bash
cd node-service
npm install
npm run dev
```

### Generate Sample Driver Data:
```bash
# Generate 30 realistic driver applications
npm run seed-db
```

This will create:
- 3 sample truck driver jobs (OTR, Local, Regional)
- 30 driver applications with realistic qualifications
- Automatic scoring based on trucking industry standards
- Mixed application statuses (pending, accepted, rejected)

---

## 🚀 Production

The system is containerized and production-ready with:
- ✅ DOT compliance validation
- ✅ CDL verification workflows
- ✅ Safety record tracking
- ✅ Experience level assessment
- ✅ Endorsement validation
- ✅ MongoDB connection pooling
- ✅ TypeScript compilation
- ✅ Docker multi-stage builds

---

## 📈 API Response Examples

### Successful Driver Application Response:
```json
{
  "success": true,
  "message": "Driver application submitted successfully",
  "data": {
    "_id": "670f123456789abcdef12345",
    "jobId": "670f123456789abcdef12340",
    "applicantName": "Mike Johnson",
    "applicantEmail": "mike.johnson@example.com",
    "answers": [
      {
        "questionId": "q1",
        "answer": "5-10 years", 
        "score": 25
      },
      {
        "questionId": "q2",
        "answer": ["Class 8 Semi-trucks", "Flatbed trailers"],
        "score": 30
      }
    ],
    "totalScore": 90,
    "maxPossibleScore": 100,
    "scorePercentage": 90,
    "status": "pending",
    "appliedAt": "2024-11-03T10:30:00.000Z"
  }
}
```

---

## 🔍 Validation Rules

### Driver Job Creation Validation:
- ✅ Title: Required, trucking industry specific
- ✅ Questions: Must include CDL and experience validation
- ✅ Location: Valid US states/cities
- ✅ Requirements: DOT compliance focused
- ✅ Scoring: Based on industry standards

### Driver Application Validation:
- ✅ CDL verification: Valid license class
- ✅ Experience validation: Minimum requirements
- ✅ Safety record: Clean driving history
- ✅ Endorsements: Industry-relevant certifications

---

## 🚛 Industry-Specific Features

### Trucking Industry Focus:
- **CDL Class Verification** (A, B, C)
- **Endorsement Tracking** (Hazmat, Passenger, etc.)
- **Experience Level Assessment** (Local, Regional, OTR)
- **Safety Record Evaluation**
- **DOT Regulation Knowledge Testing**
- **Equipment Experience Validation**
- **Route Preference Matching**

### Common Job Types Supported:
- 🛣️ **Over-the-Road (OTR)** - Long-haul, cross-country
- 🏪 **Local Delivery** - Home daily, urban routes
- 🗺️ **Regional** - Multi-state, home weekends
- 🚛 **Dedicated** - Specific customer routes
- 🏗️ **Specialized** - Heavy haul, oversized loads

---

## 📝 License

This project is for educational and development purposes.

---

## 🙏 THANK YOU!

Built with ❤️ for the trucking industry using modern Node.js, TypeScript, and MongoDB technologies.

