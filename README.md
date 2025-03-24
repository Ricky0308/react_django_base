# BASE APP

## Introduction

This project serves as a reusable base for developing applications with both frontend and backend components. It is designed to be easily extendable and customizable, providing a solid foundation for building robust applications.

## Project Structure

### Frontend

- **Frameworks & Tools**: Built with **React (v18.3.1)** and **TypeScript** using **Vite (v6.0.5)**.
- **UI Library**: Utilizes [shadcn/ui](https://github.com/shadcn/ui) style components.
- **State Management**: Manages user information using Redux and persists it in local storage.
- **Routing**: Uses **React Router (v7)** for navigation.
- **Styling**: Tailwind CSS with a custom configuration.
- **CSRF Protection**: Implements CSRF protection and automatic token refresh for secure API interactions.
- **API Configuration**: API URLs are centralized for easy management.
- **Service Pattern**: API calls are handled by dedicated service modules, ensuring a clean separation of concerns.

#### Key Directories

- `features/`: Contains feature-specific logic, such as authentication and user management.
- `components/`: Reusable UI components.
- `pages/`: Route-specific components.
- `hooks/`: Custom React hooks.


### Backend

- **Framework**: Built with Django and Django REST Framework.
- **Authentication**: Custom user model with UUID as primary key.
- **CSRF Protection**: Custom implementation for enhanced security.
- **Logging**: JSON format logging with various logger categories.

#### Key Directories

- `authentication/`: Handles user authentication, including login, logout, and user registration.
- `middlewares/`: Custom middleware for CSRF protection and other functionalities.
- `utils/`: Utility functions and helpers.

## Features

### Authentication

- **Login/Logout**: Managed via Redux in the frontend and Django REST Framework in the backend.
- **User Registration**: Allows new users to sign up and receive activation emails.
- **Token Management**: Utilizes JWT for secure token-based authentication.

### User Management

- **Profile Management**: Users can update their profiles and change their email addresses.
- **Password Reset**: Users can reset their passwords via email confirmation.

## Development Guidelines

### Frontend

- **TypeScript Strict Mode**: Enabled for type safety.
- **API Integration**: Centralized API configuration in `src/config/api.ts`.
- **Message Localization**: Centralized in `frontend/src/utils/messages.ts`.

### Backend

- **Confidential Variables**: Store sensitive data in `.env` files.
- **Custom CSRF Protection**: Ensure consistency with custom implementation.
- **Error Handling**: Use HTTP responses for predictable errors instead of exceptions.


## Docker
- **Docker Compose**: The project uses Docker Compose for container orchestration. See the `docker` directory for configuration details.
- **Backend Libraries**: After installing new libraries in the backend, update `requirements.txt` to ensure consistency across environments.
- **Frontend Container**: `npm install` must be executed within the frontend container to install dependencies.

