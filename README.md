# IT Asset Tracker API

## Project Overview

The IT Asset Tracker API is a backend application designed to manage an organization's IT assets. It provides REST API endpoints for asset and category management, with authentication and role-based access control.

## Features

- User registration and login using JWT authentication
- Role-based access control for administrators and staff
- IT asset management
- Asset category management
- Asset status tracking: `AVAILABLE`, `ASSIGNED`, and `MAINTENANCE`
- Request validation and exception handling
- PostgreSQL database integration
- Swagger UI API documentation
- Docker and Docker Compose support

## Technologies Used

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA and Hibernate
- PostgreSQL
- JSON Web Token (JWT)
- Maven
- Docker and Docker Compose
- Swagger UI / OpenAPI

## Prerequisites

- Docker Desktop
- Git (optional)

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd main-project
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your GitHub repository URL.

### 2. Configure Environment Variables

Configure the following environment variables required by the application:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

Use the database settings expected by the Docker Compose configuration. Do not publish passwords or secret keys.

### 3. Run the Application

Build and start the application and database:

```bash
docker compose up -d --build
```

Check container status:

```bash
docker compose ps
```

Stop the application:

```bash
docker compose down
```

## API Documentation

When the application is running, access the documentation at:

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

Swagger UI allows users to explore and test the documented API endpoints. Protected endpoints require valid authentication and appropriate permissions.

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/categories` | Retrieve asset categories |
| POST | `/api/categories` | Create a category |
| `/api/assets` | Asset management endpoints | Manage and retrieve assets |

Consult Swagger UI for available asset operations, request formats, and authorization requirements.

## Authentication and Authorization

The application uses Spring Security with JWT authentication.

- `ROLE_ADMIN` — Administrator access to authorized management operations.
- `ROLE_STAFF` — Staff access to permitted operations.
- Protected endpoints require authentication.
- Passwords are stored using BCrypt hashing.

## Database

PostgreSQL is used for persistent data storage. Spring Data JPA and Hibernate handle database access and entity persistence.

## Testing

Run the tests and package the application using the Maven Wrapper:

```powershell
.\mvnw.cmd clean package
```

A successful build displays `BUILD SUCCESS`.

## Security

- Keep database credentials and JWT secrets private.
- Configure the required environment variables before running the application.
- Use authentication and appropriate role permissions for protected endpoints.

## Project Purpose

This academic project demonstrates REST API development, database integration, authentication, authorization, validation, exception handling, and containerization using Spring Boot.

## Author

Student Project — IT Asset Tracker API
