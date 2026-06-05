# Task Manager Application

## Project Title & Brief Description

This project is a **Task Manager Application** built as a full-stack web application. It allows users to create, update, delete, search, filter, and reorder tasks. The application provides an intuitive interface for managing daily tasks and uses a RESTful API to perform CRUD operations. The project demonstrates full-stack development using Next.js, Express.js, MongoDB, and modern deployment platforms.

---

## Live Demo Links

### Frontend

https://studio-graphene-kappa.vercel.app/

### Backend API


https://studiographene-a6bn.onrender.com

---

## Tech Stack

### Frontend

* **Next.js** – React framework for building performant web applications.
* **TypeScript** – Type safety and better developer experience.
* **Tailwind CSS** – Utility-first styling framework.
* **Axios** – API communication between frontend and backend.

### Backend

* **Node.js** – JavaScript runtime environment.
* **Express.js** – Backend framework for creating REST APIs.
* **MongoDB** – NoSQL database for storing task data.
* **Mongoose** – ODM for interacting with MongoDB.
* **CORS** – Cross-origin resource sharing support.
* **dotenv** – Environment variable management.

### Deployment

* **Vercel** – Frontend hosting.
* **Render** – Backend hosting.

---

## How to Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/himanshu12sh/StudioGraphene
cd task-manager
```

### 2. Configure Backend Environment Variables

Create:

```bash
backend/.env
```

Add:

```env
PORT=5000
MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Start Backend Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### 5. Configure Frontend Environment Variables

Create:

```bash
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 6. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 7. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## API Documentation

### Get All Tasks

**Method**

```http
GET
```

**Path**

```http
/api/tasks
```

**Query Parameters**

| Parameter | Description       |
| --------- | ----------------- |
| status    | active, completed |
| search    | text search       |

**Response**

```json
{
  "tasks": [],
  "counts": {
    "all": 0,
    "active": 0,
    "completed": 0
  }
}
```

---

### Create Task

**Method**

```http
POST
```

**Path**

```http
/api/tasks
```

**Request Body**

```json
{
  "title": "Complete assignment",
  "description": "Finish project documentation",
  "dueDate": "2026-06-30"
}
```

**Response**

```json
{
  "_id": "task_id",
  "title": "Complete assignment",
  "description": "Finish project documentation",
  "status": "active"
}
```

---

### Update Task

**Method**

```http
PUT
```

**Path**

```http
/api/tasks/:id
```

**Request Body**

```json
{
  "title": "Updated task title"
}
```

**Response**

```json
{
  "_id": "task_id",
  "title": "Updated task title"
}
```

---

### Toggle Task Status

**Method**

```http
PATCH
```

**Path**

```http
/api/tasks/:id/toggle
```

**Response**

```json
{
  "_id": "task_id",
  "status": "completed"
}
```

---

### Delete Task

**Method**

```http
DELETE
```

**Path**

```http
/api/tasks/:id
```

**Response**

```json
{
  "message": "Task deleted successfully"
}
```

---

### Reorder Tasks

**Method**

```http
PUT
```

**Path**

```http
/api/tasks/reorder/bulk
```

**Request Body**

```json
{
  "tasks": [
    {
      "_id": "task1",
      "order": 1
    },
    {
      "_id": "task2",
      "order": 2
    }
  ]
}
```

**Response**

```json
{
  "tasks": []
}
```

---

## Project Structure

```txt
task-manager
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controller
│   │   └── taskController.js
│   ├── models
│   │   └── Task.js
│   ├── routes
│   │   └── taskRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── app
│   ├── components
│   ├── services
│   ├── types
│   ├── public
│   └── package.json
│
└── README.md
```

### Folder Overview

* **backend/config** – Database configuration.
* **backend/models** – Mongoose schemas and models.
* **backend/controller** – Business logic and API handlers.
* **backend/routes** – API route definitions.
* **frontend/app** – Next.js pages and routing.
* **frontend/components** – Reusable UI components.
* **frontend/services** – API integration layer.
* **frontend/types** – Shared TypeScript types.

---

## Next Steps

The current implementation focuses on core task management functionality. Future improvements could include:

* User authentication and authorization.
* Task categories and labels.
* Task priorities.
* Real-time updates using WebSockets.
* Unit and integration testing.
* Pagination for large task datasets.
* Activity history and audit logs.
* Dark mode support.
* Team collaboration and task assignment.
* Docker-based deployment.
