# TaskFlow AI

<div align="center">

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Intelligent Task Management System for Software Development Teams**

[Features](#-key-features) · [Tech Stack](#-technology-stack) · [Architecture](#-architecture) · [Project Structure](#-project-structure)

</div>

---

## 📋 Project Overview

**TaskFlow AI** is a modern full-stack task management platform designed for software development teams. It enables users to securely manage their tasks through authentication, role-based authorization, real-time collaboration, and AI-powered task assistance.

The application follows **Clean Architecture** principles and demonstrates modern backend engineering practices — including repository patterns, dependency injection, comprehensive validation, and automated testing.

> This project was developed as a **Software Engineer (Full Stack – Backend Focused)** take-home assignment, evaluating end-to-end application design, API development, data modelling, authentication, testing, frontend integration, and documentation quality.

---

## ✨ Key Features

### 🔐 Authentication

| Feature | Description |
|---------|-------------|
| User Registration | Secure account creation with validated input |
| Secure Login | Credential-based authentication with JWT tokens |
| JWT Authentication | Stateless, token-based API security |
| Role-Based Access Control | **User** and **Admin** roles with granular permissions |

**Role Permissions**

| Role | Permissions |
|------|-------------|
| **User** | Create, view, update, and delete own tasks |
| **Admin** | View and manage all tasks across the system |

---

### 📝 Task Management

- ✅ **Create Tasks** — Add new tasks with title, description, status, due date, and owner
- ✏️ **Update Tasks** — Modify existing task details
- 🗑️ **Delete Tasks** — Remove tasks with proper authorization
- 📋 **View Tasks** — Browse paginated task listings
- 🔍 **Task Details** — Retrieve individual tasks by ID
- 📄 **Pagination** — Efficient data retrieval for large task sets
- 🏷️ **Filtering by Status** — Filter tasks by workflow state
- 👤 **Filtering by Owner** — Filter tasks by assigned user

---

### ⚡ Real-Time Features

- **SignalR Real-Time Task Updates** — Connected clients receive live task changes (create, update, delete) without page refresh

---

### 🤖 AI Features

| Feature | Description |
|---------|-------------|
| AI-Powered Description Enhancement | Improve task descriptions with intelligent suggestions |
| AI-Generated Subtasks | Automatically break down tasks into actionable subtasks |
| Priority Suggestions | Smart priority recommendations based on task context |
| Estimated Effort Generation | AI-driven effort estimation for planning |

---

### 🏗️ Backend Features

```
✔ Clean Architecture          ✔ Repository Pattern
✔ Dependency Injection        ✔ Entity Framework Core
✔ SQL Server                  ✔ RESTful API
✔ Swagger Documentation       ✔ Global Exception Handling
✔ Fluent Validation           ✔ Structured Logging
```

---

### 🎨 Frontend Features

- **React** with **TypeScript** for type-safe component development
- **Responsive UI** — Mobile-friendly layout across devices
- **Dashboard** — Centralized task overview and management
- **Authentication Pages** — Registration, login, and logout flows

---

### 🧪 Testing

| Type | Framework |
|------|-----------|
| Unit Tests | xUnit |
| Integration Tests | xUnit + ASP.NET Core Test Host |

---

### 🚀 CI/CD

- **GitHub Actions** pipeline that runs on pushes and pull requests
- Automated dependency installation, linting, and test execution

---

## 🛠️ Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| ASP.NET Core 8 | Web API framework |
| C# | Primary backend language |
| Entity Framework Core | ORM and data access |
| SQL Server | Relational database |
| SignalR | Real-time WebSocket communication |
| JWT Authentication | Token-based security |

### Frontend

| Technology | Purpose |
|------------|---------|
| React | UI component library |
| TypeScript | Type-safe JavaScript |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |

### Testing

| Technology | Purpose |
|------------|---------|
| xUnit | Unit and integration testing |

### Tools

| Tool | Purpose |
|------|---------|
| Git & GitHub | Version control and collaboration |
| Swagger | Interactive API documentation |
| Postman | API testing and collection sharing |
|VS-code  | Developments |
| Cursor AI | AI-assisted development |

---

## 📁 Project Structure

```
take-home-assignment/
│
├── backend/
│   ├── src/
│   │   ├── TaskFlowAI.Api/              # API Layer — Controllers, Middleware, SignalR Hubs
│   │   ├── TaskFlowAI.Application/      # Application Layer — Services, DTOs, Validators
│   │   ├── TaskFlowAI.Domain/           # Domain Layer — Entities, Enums, Interfaces
│   │   └── TaskFlowAI.Infrastructure/   # Infrastructure Layer — EF Core, Repositories, Auth
│   │
│   └── tests/
│       ├── TaskFlowAI.UnitTests/        # Unit test suite
│       └── TaskFlowAI.IntegrationTests/ # Integration test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/                  # Reusable UI components
│   │   ├── pages/                       # Route-level page components
│   │   ├── services/                    # API client and SignalR services
│   │   ├── hooks/                         # Custom React hooks
│   │   └── types/                       # TypeScript type definitions
│   └── public/
│
├── docs/
│   ├── postman/                         # Postman collection and environment
│   └── architecture/                    # Architecture diagrams and decisions
│
├── .github/
│   └── workflows/
│       └── ci.yml                       # GitHub Actions CI pipeline
│
└── README.md
```

---

## 🏛️ Architecture

TaskFlow AI follows **Clean Architecture** to enforce separation of concerns, testability, and maintainability. Dependencies flow inward — outer layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  Controllers · Middleware · SignalR Hubs · Swagger          │
├─────────────────────────────────────────────────────────────┤
│                  Application Layer                          │
│  Services · DTOs · Mappings · FluentValidation · Interfaces │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  Entities · Enums · Domain Interfaces · Business Rules      │
├─────────────────────────────────────────────────────────────┤
│                Infrastructure Layer                           │
│  EF Core · Repositories · JWT Auth · AI Service · Logging   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        SQL Server
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **API Layer** | HTTP endpoints, request/response handling, authentication middleware, SignalR hubs, and Swagger configuration |
| **Application Layer** | Business use cases, application services, DTOs, validation rules, and orchestration logic |
| **Domain Layer** | Core business entities, enums, domain interfaces, and business rules — free of framework dependencies |
| **Infrastructure Layer** | Data persistence (EF Core), repository implementations, external service integrations (AI), and cross-cutting concerns |

### Key Design Principles

- **Dependency Inversion** — Application and Domain layers define interfaces; Infrastructure provides implementations
- **Repository Pattern** — Abstracts data access behind clean interfaces
- **Single Responsibility** — Each layer and service has a focused, well-defined purpose
- **Testability** — Loose coupling enables comprehensive unit and integration testing

---

## 🔮 Future Improvements

With additional time, the following enhancements would further strengthen the platform:

| Enhancement | Description |
|-------------|-------------|
| 🎯 **AI Task Prioritization** | Machine learning–driven task ranking based on deadlines, dependencies, and team workload |
| 📧 **Email Notifications** | Automated alerts for task assignments, due dates, and status changes |
| 🐳 **Docker Deployment** | Containerized backend, frontend, and database for consistent environments |
| ☸️ **Kubernetes** | Orchestrated deployment with auto-scaling and rolling updates |
| 📱 **Mobile Application** | Native or cross-platform mobile client for on-the-go task management |
| 📅 **Calendar Integration** | Sync tasks with Google Calendar, Outlook, and other scheduling tools |

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 TaskFlow AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ as a Software Engineer (Full Stack – Backend Focused) Take-Home Assignment**

</div>
