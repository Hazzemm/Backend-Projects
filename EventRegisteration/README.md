# Event Registration System

This API allows users to register for events, manage event details, and handle user authentication. It uses **Node.js**, **Express**, and **MongoDB**.

## Base URL

Replace `{PORT}` with the actual server port (default is `5000`).

---

## Endpoints

### User Routes

#### Register a New User

- **URL**: `/api/user/register`
- **Method**: `POST`
- **Description**: Registers a new user in the system.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
- **Response**:
  ```json
  {
    "staus": "success",
    "data": {
      "message": "user registered successfully"
    }
  }
- **Errors**:
  - 400: User already exists.
#### Login User
- **URL**: `/api/user/login`
- **Method**: `POST`
- **Description**: Logs in a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
- **Response**:
  ```json
  {
  "token": "string"
  }
- **Errors**:
  - Invalid credentials or wrong password.
### Event Routes
#### Get All Events
- **URL**: `/api/events`
- **Method**: `GET`
- **Description**: Retrieves a list of all available events.
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "capacity": "number",
      "registeredUsers": []
    }
  ]
#### Create a New Event (Admin Only)
- **URL**: `/api/events`
- **Method**: `POST`
- **Description**: Creates a new event. Requires admin access
- **Request Headers**:
  ```css
  Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "string",
    "capacity": "number"
  } 
- **Response**:
  ```json
  {
    "staus": "success",
    "data": {
      "message": "Event added successfully",
      "event": {}
    }
  }
- **Errors**:
  - 403: Access denied if the user is not an admin.
### Registration Routes
#### Register for an Event
- **URL**: `/api/registrations/register`
- **Method**: `POST`
- **Description**: Registers a user for an event.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "eventId": "string"
  }
- **Response**:
  ```json
  {
    "staus": "success",
    "data": {
      "message": "Registered successfully"
    }
  }
- **Errors**:
  - 404: Event not found.
  - 400: Event is full.

### Authentication
The API uses JWT for authentication. Include the token in the Authorization header for protected routes: Authorization: Bearer {token}

Tokens expire in 1 hour. Admin-only routes require a token with an admin role.

### Environment Variables
- `CONNECTION_STRING`: MongoDB connection string.
- `JWT_SECRET`: Secret for signing JWT tokens.
- `PORT`: Server port (optional, defaults to `5000`).

