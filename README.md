<h1 align="center">Event Permit and Venue Booking System</h1>

<p align="center">
  <strong>A Secure Digital Platform for Venue Discovery, Booking Management, and Event Permit Applications in Rwanda</strong>
</p>

<p align="center">
  </a>
  <a href="http://localhost:3000/api">
    <img src="https://img.shields.io/badge/Swagger-API%20Docs-blue" alt="Swagger Docs" />
  </a>
  <img src="https://img.shields.io/badge/PostgreSQL-13+-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/status-complete-success" alt="Project Status" />
</p>

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Objectives Achieved](#core-objectives-achieved)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Key Features](#key-features)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Environment Configuration](#environment-configuration)
   * [Run the Application](#run-the-application)
8. [API Documentation](#api-documentation)
9. [API Endpoints Summary](#api-endpoints-summary)
10. [Security Features](#security-features)
11. [Testing the System](#testing-the-system)
12. [Deployment Notes](#deployment-notes)
13. [Future Enhancements](#future-enhancements)
14. [License](#license)
15. [Acknowledgments](#acknowledgments)

---

## Project Overview

The Event Permit and Venue Booking System is a full-featured backend application designed to digitize and streamline the process of event organization in Rwanda. It supports the national digital transformation agenda under the Smart Rwanda Master Plan and aligns with initiatives by the Rwanda Development Board (RDB).

This system replaces manual, fragmented processes (phone calls, physical visits, paper forms) with a centralized, secure, and efficient digital platform.

---

## Core Objectives Achieved

* Enable public discovery of event venues with geolocation-based search
* Facilitate secure venue booking requests with automatic conflict detection
* Allow permit applications (noise, safety, alcohol, etc.) linked to approved bookings
* Implement role-based workflows with strict access control
* Provide administrative dashboards for venue managers and authorities
* Ensure transparency, fairness, and compliance with local regulations

---

## User Roles & Permissions

| Role          | Key Responsibilities                                                       |
| ------------- | -------------------------------------------------------------------------- |
| Organizer     | Search venues, submit booking requests, apply for permits                  |
| Venue Manager | Create and manage venues, approve/reject booking requests for their venues |
| Authority     | Review and approve/reject permit applications, full system oversight       |

---

## Key Features

* **Geolocation Venue Search** – Proximity-based discovery using the Haversine formula
* **Conflict-Free Booking System** – Prevents double-booking through date overlap detection
* **Multi-Permit Support** – Noise control, public safety, alcohol service, health, and more
* **Secure Authentication** – JWT with role-based and ownership guards
* **Interactive API Documentation** – Complete Swagger/OpenAPI with examples and JWT support
* **Audit Trail** – Full timestamp tracking and status history
* **Responsive Workflow** – Pending → Approved/Rejected states with notifications potential

---

## Technology Stack

* **Framework:** NestJS (TypeScript)
* **ORM:** TypeORM
* **Database:** PostgreSQL
* **Authentication:** JWT + bcrypt
* **Validation:** class-validator + ValidationPipe
* **API Docs:** @nestjs/swagger (OpenAPI 3.0)
* **Geolocation:** Pure PostgreSQL Haversine formula (no external dependencies)

---

## Project Structure

```
src/
├── auth/               # JWT login and authentication
├── users/              # User management with restricted role creation
├── venues/             # Venue CRUD + geolocation search
├── bookings/           # Booking requests, conflict detection, approval workflow
├── permits/            # Permit applications and authority approval
├── common/             # Shared enums (e.g., RequestStatus)
├── app.controller.ts   # Professional home endpoint with system info
├── app.module.ts       # Root module
└── main.ts             # Bootstrap + enhanced Swagger configuration
```

---

## Getting Started

### Prerequisites

* Node.js ≥ 18
* PostgreSQL 13+
* npm or yarn

### Installation

```bash
git clone https://github.com/E-ner/event-permit-booking-system.git
cd event-permit-system/backend
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_postgres_user
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=event_permit_db

JWT_SECRET=your_very_long_and_secure_secret_key_here
```

### Run the Application

```bash
# Development (hot-reload)
npm run start:dev

# Production
npm run start:prod
```

Server runs at: `http://localhost:3000`

---

## API Documentation

Interactive Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)

Features:

* Full endpoint descriptions and examples
* JWT authentication support (click "Authorize")
* Request/response schemas
* Role-based operation visibility
* Search and filter capabilities

---

## API Endpoints Summary

| Module   | Key Endpoints              | Description                            |
| -------- | -------------------------- | -------------------------------------- |
| Auth     | POST /auth/login           | Login and receive JWT token            |
| Users    | POST /users/register       | Public registration (Organizer only)   |
|          | POST /users/create         | Authority creates restricted roles     |
|          | GET /users                 | List all users (Authority only)        |
| Venues   | GET /venues/search         | Public geolocation + keyword search    |
|          | POST /venues               | Create venue (Venue Manager only)      |
| Bookings | POST /bookings             | Request booking (Organizer)            |
|          | PATCH /bookings/:id/status | Approve/reject (Venue Manager)         |
| Permits  | POST /permits              | Apply for permit (on approved booking) |
|          | PATCH /permits/:id/status  | Approve/reject permit (Authority only) |

---

## Security Features

* JWT authentication with 1-hour expiry
* Role-based access control using custom `RolesGuard`
* Ownership enforcement (users can only manage their own data)
* Restricted creation of privileged roles (Venue Manager, Authority)
* Input validation and UUID parsing with `ParseUUIDPipe`
* Password hashing with bcrypt

---

## Testing the System

A comprehensive batch testing script (`test-full-system.bat`) is included to:

* Test authentication for all roles
* Create venues, bookings, and permits
* Verify conflict detection
* Validate role-based permissions (403 errors where expected)

Run it after starting the server to see the full workflow in action.

---

## Deployment Notes

* Use environment variables in production
* Set `synchronize: false` in TypeORM config
* Enable HTTPS
* Consider adding rate limiting and logging

---

## Future Enhancements

* Frontend application (React/Vue/Angular)
* Email/SMS notifications
* Document upload for permit evidence
* Analytics dashboard
* Integration with government systems

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

* Built with NestJS
* Inspired by Rwanda's Smart Rwanda Master Plan and RDB event sector initiatives
* Special thanks to academic supervisors and contributors
