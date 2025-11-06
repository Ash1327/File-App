# Node.js + Express + MongoDB File Handling Application

A RESTful API application built with Node.js, Express.js, and MongoDB that handles user management, organization management, file uploads/downloads, and provides analytics through aggregation pipelines. Built with modular architecture and Joi validation.

## Features

- **User Management**: Create users with roles (admin/user) and organization associations
- **Organization Management**: Create organizations
- **File Operations**: Upload and download files with streaming support
- **Analytics**: Aggregate data to get insights about users and files by organization
- **Modular Architecture**: Clean separation of concerns with modules (model, service, controller, validation)
- **Joi Validation**: Comprehensive input validation using Joi schemas
- **Consistent Response Format**: Standardized API responses across all endpoints

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **Joi** - Schema validation library
- **ES6+** - Modern JavaScript syntax with modules

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - Make sure MongoDB is running on your system
- npm or yarn

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fileapp
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows (if installed as service, it should start automatically)
   # Or use:
   mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

## Running the Application

**Start the server:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "data": null,
  "details": ["Additional error details"]
}
```

### Basic CRUD

#### Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "organizationId": "507f1f77bcf86cd799439011", // Optional
  "role": "admin" // or "user"
}
```

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "organizationId": "...",
    "role": "admin",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Create Organization
```
POST /api/organizations
Content-Type: application/json

{
  "name": "Acme Corporation"
}
```

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Organization created successfully",
  "data": {
    "_id": "...",
    "name": "Acme Corporation",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### File Operations

#### Upload File
```
POST /api/files/upload
Content-Type: multipart/form-data

Form Data:
- file: [file to upload]
- uploadedBy: "507f1f77bcf86cd799439011" // User ID
```

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "...",
    "fileName": "document.pdf",
    "uploadedBy": { ... },
    "createdAt": "..."
  }
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@/path/to/your/file.pdf" \
  -F "uploadedBy=507f1f77bcf86cd799439011"
```

#### Download File
```
GET /api/files/download/:id
```

**Response:** Binary file stream with appropriate headers<br>
Note :- 
Click on the dropdown of Send button in the postman, Send and download will come ,Click that button
**Example:**
```bash
curl -O http://localhost:3000/api/files/download/507f1f77bcf86cd799439011
```

### Analytics APIs

#### Users by Organization
```
GET /api/analytics/users-by-organization
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Users by organization analytics retrieved successfully",
  "data": [
    {
      "organizationId": "...",
      "organizationName": "Acme Corporation",
      "userCount": 5,
      "users": [
        {
          "userId": "...",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "admin"
        }
      ]
    }
  ]
}
```

#### Organization Files Analytics
```
GET /api/analytics/organization-files
```

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Organization files analytics retrieved successfully",
  "data": [
    {
      "organizationId": "...",
      "organizationName": "Acme Corporation",
      "totalFiles": 10,
      "uploadedByUsers": [
        {
          "userId": "...",
          "userName": "John Doe",
          "userEmail": "john@example.com"
        }
      ]
    }
  ]
}
```

## Database Models

### User
- `name` (String, required, 3-50 characters)
- `email` (String, required, unique, valid email format)
- `organizationId` (ObjectId, ref: Organization, optional)
- `role` (String: 'admin' or 'user', required)

### Organization
- `name` (String, required, 3-100 characters)
- `createdAt` (Date)

### File
- `fileName` (String)
- `filePath` (String)
- `uploadedBy` (ObjectId, ref: User)
- `createdAt` (Date)

## Project Structure

```
assignment/
├── config/
│   └── multerConfig.js           # Multer configuration for file uploads
├── middleware/
│   ├── errorHandler.js           # Global error handling middleware
│   ├── validate.js               # Centralized Joi validation middleware
│   └── objectId.js                # MongoDB ObjectId validator helper
├── modules/
│   ├── user/
│   │   ├── user.model.js         # User Mongoose model
│   │   ├── user.service.js       # User business logic
│   │   ├── user.controller.js    # User request handlers
│   │   ├── user.validate.js      # User validation schemas
│   │   └── index.js              # User module exports
│   ├── organization/
│   │   ├── organization.model.js # Organization Mongoose model
│   │   ├── organization.service.js # Organization business logic
│   │   ├── organization.controller.js # Organization request handlers
│   │   ├── organization.validate.js # Organization validation schemas
│   │   └── index.js              # Organization module exports
│   ├── file/
│   │   ├── file.model.js         # File Mongoose model
│   │   ├── file.service.js       # File business logic
│   │   ├── file.controller.js    # File request handlers
│   │   ├── file.validate.js      # File validation schemas
│   │   └── index.js              # File module exports
│   └── analytics/
│       ├── analytics.service.js  # Analytics aggregation logic
│       ├── analytics.controller.js # Analytics request handlers
│       └── index.js              # Analytics module exports
├── routes/
│   ├── user.routes.js            # User routes
│   ├── organization.routes.js   # Organization routes
│   ├── file.routes.js            # File upload/download routes
│   ├── analytics.routes.js      # Analytics aggregation routes
│   └── index.js                 # Routes aggregator
├── uploads/                      # Directory for uploaded files (created automatically)
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies and scripts
├── postman_collection.json       # Postman API collection
├── server.js                     # Main server file
└── README.md                     # This file
```

## Technical Implementation Details

### Architecture

- **Modular Structure**: Each feature (user, organization, file, analytics) is organized into its own module
- **Separation of Concerns**: 
  - Models: Database schemas
  - Services: Business logic
  - Controllers: HTTP request/response handling
  - Validation: Input validation with Joi

### Validation

- **Joi Schemas**: All input validation uses Joi schemas
- **Centralized Middleware**: Single validation middleware used across all modules
- **ObjectId Validation**: Custom validator for MongoDB ObjectId format
- **Error Handling**: Validation errors return consistent format with details

### File Upload
- Uses Multer with disk storage
- Files are streamed to disk in the `uploads/` directory
- Automatic filename generation with timestamps
- 10MB file size limit (configurable in `config/multerConfig.js`)
- File existence check integrated into validation
- Automatic cleanup on validation errors

### File Download
- Uses `fs.createReadStream()` for streaming downloads
- Returns file with proper headers (Content-Type, Content-Disposition, Content-Length)
- Proper error handling for missing files

### Aggregation Pipelines
1. **Users by Organization**: 
   - Uses `$lookup` to join with organizations
   - Uses `$group` to count users per organization
   - Returns organization details with user count and user list

2. **Organization Files**: 
   - Uses multiple `$lookup` stages to join files → users → organizations
   - Uses `$group` to aggregate file counts and user lists
   - Returns organization details with total files and list of users who uploaded

## Error Handling

The application includes comprehensive error handling:
- **Validation errors** (400) - Joi validation failures with detailed messages
- **Duplicate key errors** (409) - Email already exists, etc.
- **Not found errors** (404) - User not found, file not found, etc.
- **Invalid ID format errors** (400) - Invalid ObjectId format
- **Server errors** (500) - Internal server errors

All errors follow the consistent response format with `success: false`.

## Testing the API

You can test the API using:
- **Postman** - Import the `postman_collection.json` file
- **curl** - Command-line tool
- **Thunder Client** - VS Code extension
- **Any HTTP client**

### Example Workflow

1. **Create an organization:**
   ```bash
   POST /api/organizations
   { "name": "Tech Corp" }
   ```
   Save the `_id` from the response as `organizationId`

2. **Create a user:**
   ```bash
   POST /api/users
   {
     "name": "Jane Doe",
     "email": "jane@techcorp.com",
     "organizationId": "<org-id-from-step-1>",
     "role": "admin"
   }
   ```
   Save the `_id` from the response as `userId`

3. **Upload a file:**
   ```bash
   POST /api/files/upload
   Form data: file + uploadedBy=<user-id-from-step-2>
   ```
   Save the `id` from the response as `fileId`

4. **View analytics:**
   ```bash
   GET /api/analytics/users-by-organization
   GET /api/analytics/organization-files
   ```

## Postman Collection

Import the `postman_collection.json` file into Postman to get started quickly. The collection includes:
- All API endpoints
- Example requests and responses
- Environment variables for easy testing
- Pre-configured request bodies

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `.env` file
- Check MongoDB logs for errors

### File Upload Issues
- Ensure `uploads/` directory has write permissions
- Check file size limits (default: 10MB)
- Verify `uploadedBy` user ID exists
- Files are automatically deleted on validation errors

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using the port

### Validation Errors
- Check the `details` array in error response for specific validation issues
- Ensure all required fields are provided
- Verify data types match expected formats (e.g., ObjectId format)

## Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `multer` - File upload middleware
- `joi` - Schema validation
- `dotenv` - Environment variable management

## License

ISC

## Author

Ashish Sharma<br>
ashishsharma10436@gmail.com







