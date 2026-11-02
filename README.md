# IT Asset Tracker

## Project Description

IT Asset Tracker is a web-based application designed to manage and track an organization's IT equipment. It allows administrators to manage assets, organize equipment by categories, assign assets to staff members, and track asset availability.

Staff members can log in and view the equipment assigned to their accounts.

## Technologies Used

### Backend

- Java 21
- Spring Boot 3.5.6
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- JWT Authentication
- Maven
- Docker and Docker Compose

### Frontend

- React
- JavaScript
- Vite
- React Router
- Axios
- HTML and CSS

## Main Features

- User registration and login
- JWT-based authentication
- Role-based access control (ADMIN and STAFF)
- Password encryption using BCrypt
- Asset creation and management
- Asset categories management
- Asset assignment to staff members
- Asset return management
- Asset status tracking
- View assets assigned to the logged-in staff member
- Input validation and error handling
- PostgreSQL database integration
- Docker-based application setup

## Asset Status

The application supports three asset statuses:

- AVAILABLE
- ASSIGNED
- MAINTENANCE

## User Roles

### ADMIN

- View all assets
- Add new assets
- Delete assets
- Manage categories
- Assign assets to staff members
- Return assigned assets

### STAFF

- View available asset information
- View asset categories
- View equipment assigned to their account

## Project Structure

```text
IT-Asset-Tracker/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/main/project/
│   │   │   └── resources/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Requirements

Make sure you have installed:

- Java 21
- Node.js and npm
- Docker Desktop
- Git

## How to Run the Project

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd IT-Asset-Tracker
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure Backend Environment Variables

Inside the `backend` folder, create a `.env` file:

```env
DB_PASSWORD=your_database_password
JWT_SECRET=your_long_random_jwt_secret
```

Use your own secure values. Do not upload the `.env` file to GitHub.

### 3. Start the Backend and Database

From the project directory, run:

```bash
cd backend
docker compose up -d --build
```

The Spring Boot backend runs on:

```text
http://localhost:8080
```

### 4. Start the React Frontend

Open another terminal from the project directory:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint                           | Description          |
| ------ | ---------------------------------- | -------------------- |
| POST   | `/api/auth/register`               | Register a user      |
| POST   | `/api/auth/login`                  | User login           |
| GET    | `/api/categories`                  | View categories      |
| POST   | `/api/categories`                  | Create a category    |
| GET    | `/api/assets`                      | View assets          |
| GET    | `/api/assets/my-assets`            | View assigned assets |
| POST   | `/api/assets`                      | Create an asset      |
| PATCH  | `/api/assets/{id}/assign/{userId}` | Assign an asset      |
| PATCH  | `/api/assets/{id}/return`          | Return an asset      |
| DELETE | `/api/assets/{id}`                 | Delete an asset      |

## Security

- JWT authentication protects secured API endpoints.
- BCrypt is used for password hashing.
- Role-based authorization restricts administrative operations.
- Request validation helps prevent invalid data.
- Sensitive database credentials should be configured using environment variables.

## Author

IT Asset Tracker Project

## License

This project was developed for educational purposes.
