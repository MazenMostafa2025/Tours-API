# Tours-API
This project is a RESTful API for managing tours, users, and reviews.

Routes are protected based on if a user is logged in or not and on the user role.

Routes
Tour Routes
GET /tours/ - Get all tours (User and Guide roles)
POST /tours/ - Create a new tour (Admin role)
GET /tours/:id - Get a single tour by ID (User and Guide roles)
PATCH /tours/:id - Update a tour by ID (Admin role)
DELETE /tours/:id - Delete a tour by ID (Admin role)

User Routes
POST /users/signup - Sign up a new user
POST /users/login - Login an existing user
POST /users/forgetPassword - Request to reset password
PATCH /users/resetPassword/:resetToken - Reset user password
GET /users/logout - Logout user
GET /users/getMe - Get current user details
PATCH /users/updateMe - Update current user details
PATCH /users/updatePassword - Update current user password
DELETE /users/deleteMe - Delete current user (and associated data)

Review Routes
GET /reviews/ - Get all reviews
POST /reviews/ - Create a new review (User role)
GET /reviews/:id - Get a single review by ID
PATCH /reviews/:id - Update a review by ID (Admin and User roles)
DELETE /reviews/:id - Delete a review by ID (Admin and User roles)

Usage
Use a tool like Postman to send requests to the API endpoints.
