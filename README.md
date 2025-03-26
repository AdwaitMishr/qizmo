# 📝 Qizmo - Automated MCQ-Based Exam System

[![GitHub last commit](https://img.shields.io/github/last-commit/aryansharma2k4/dev-stage)](https://img.shields.io/github/last-commit/aryansharma2k4/dev-stage)
[![GitHub issues](https://img.shields.io/github/issues-raw/aryansharma2k4/dev-stage)](https://img.shields.io/github/issues-raw/aryansharma2k4/dev-stage)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/aryansharma2k4/dev-stage)](https://img.shields.io/github/issues-pr/aryansharma2k4/dev-stage)
[![GitHub license](https://img.shields.io/github/license/aryansharma2k4/dev-stage)](https://img.shields.io/github/license/aryansharma2k4/dev-stage)

Qizmo is a secure, scalable, and automated platform designed for MCQ-based online assessments. It empowers universities and institutions to conduct seamless, cheat-resistant exams with real-time monitoring, automated grading, and detailed performance analytics.

## 🚀 Features

### 🔐 User Authentication & Role-Based Access
- **Admins**: Manage the platform, monitor exams, and analyze performance metrics
- **Faculty**: 
  - Create and manage exams
  - Add questions to the question bank
  - Set time limits and randomize question order
- **Students**:
  - Take exams with a streamlined and user-friendly interface
  - View results instantly after submission

### 🛠️ MCQ Exam Creation & Management
- **Exam Builder**: Select questions from a pool or add new ones
- **Randomization**: Unique question order for each student to prevent cheating
- **Time Management**:
  - Custom time limits
  - Auto-submission when timer expires

### ⚙️ Automated Grading & Result Generation
- Instant response evaluation
- Immediate score display
- Detailed result reports for faculty and students

### 📊 Real-Time Exam Monitoring
- Session tracking
- Prevent multiple logins
- Real-time progress tracking
- Prevent exam reattempts

## 💻 Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- TanStack Query
- tRPC

### Backend
- tRPC
- PostgreSQL
- Prisma ORM

### Security
- JWT Authentication
- Session Management
- Rate Limiting & IP Logging

## 🚦 Quick Start

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/aryansharma2k4/qizmo.git
cd qizmo
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file with:
```ini
DATABASE_URL=postgres://user:password@localhost:5432/qizmo
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_key
```

4. Run the application
```bash
npm run dev
```

5. Open `http://localhost:3000`

## 🛠️ User Roles

### Admin
- Create and manage user accounts
- Monitor exams in real-time
- View performance analytics

### Faculty
- Create and manage question pools
- Build and schedule exams
- Review student scores

### Students
- Take secure exams
- View immediate results
- Access exam history and performance analytics

## 💡 Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Submit a pull request


## 🤝 Support
For support, please open an issue in the GitHub repository.