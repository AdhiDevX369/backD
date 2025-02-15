# Authentication API Guide

## Components

### 1. Register User
```javascript
// Request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user" // Optional, defaults to "user"
}

// Response - Success (201)
{
  "success": true,
  "token": "jwt.token.here",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

// Response - Error (400)
{
  "error": "Email already exists"
}
```

### 2. User Login
```javascript
// Request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response - Success (200)
{
  "success": true,
  "token": "jwt.token.here",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

// Response - Error (401)
{
  "error": "Invalid credentials"
}
```

### 3. Get All Users (Admin Only)
```javascript
// Request
GET /api/auth/users
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
[
  {
    "id": "userId1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "is_active": true
  },
  {
    "id": "userId2",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true
  }
]

// Response - Error (403)
{
  "error": "Access denied. Admin only."
}
```

### 4. Get Single User
```javascript
// Request
GET /api/auth/users/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "is_active": true
}

// Response - Error (404)
{
  "error": "User not found"
}
```

### 5. Update User Profile
```javascript
// Request
PUT /api/auth/users/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}
Body:
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

// Response - Success (200)
{
  "id": "userId",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "user",
  "is_active": true
}

// Response - Error (403)
{
  "error": "You can only update your own profile"
}
```

### 6. Delete User
```javascript
// Request
DELETE /api/auth/users/:id
Headers:
{
  "Authorization": "Bearer jwt.token.here"
}

// Response - Success (200)
{
  "message": "User deleted successfully"
}

// Response - Error (403)
{
  "error": "You can only delete your own account"
}
```

## Implementation Notes

1. All authenticated routes require a valid JWT token in the Authorization header
2. Passwords are hashed using bcrypt before storage
3. JWT tokens expire after 24 hours
4. The `role` field can only be modified by administrators
5. User deletion is soft delete (sets is_active to false)
6. Password updates are not allowed through the update profile endpoint

## Error Handling

Common HTTP Status Codes:
- 200: Successful operation
- 201: Successfully created
- 400: Bad request (invalid input)
- 401: Unauthorized (invalid credentials)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 500: Server error

## Security Features

1. Password Hashing
   - Uses bcrypt with 10 rounds of salting
   - Passwords are never returned in responses

2. JWT Authentication
   - Tokens include user ID and role
   - 24-hour expiration
   - Required for protected routes

3. Role-Based Access Control
   - Regular users can only modify their own data
   - Admin users can access and modify all user data
   - Role elevation is restricted to admin users