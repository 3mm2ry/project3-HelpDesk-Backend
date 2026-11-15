# HelpDesk Pro – Backend

The backend of **HelpDesk Pro**, an IT Service Management Platform. It provides the REST API used by the frontend to manage support tickets, IT assets, users, departments, office locations, comments, and AI-assisted IT support.

## Main Features

- **Authentication:** User registration and sign-in, with token-based authentication.
- **Ticket Management:** Create, view, update, and delete support tickets. Tickets support priority, status, category, contact method, and image uploads.
- **Comments:** Add comments to tickets and manage existing comments.
- **IT Asset Management:** Manage equipment, submit borrowing requests, cancel requests, approve or reject requests, and record asset returns.
- **User Management:** View and manage user information, roles, departments, and locations.
- **Department Management:** Create, view, update, and delete departments.
- **Office Locations:** Manage office and desk location information.
- **AI Assistant:** An authenticated chat endpoint that connects to the Gemini API to provide basic IT troubleshooting guidance.

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT) authentication
- Axios
- Multer for file uploads
- Google Gemini API
- dotenv, CORS, and Morgan

## Project Structure

```text
Backend/
└── auth-template-backend/
    ├── config/             # Database connection
    ├── middleware/         # Authentication and upload middleware
    ├── models/             # MongoDB models
    ├── routes/             # API route handlers
    ├── public/uploads/     # Uploaded images
    ├── ERD/                # Database diagram and exported image
    ├── server.js           # Express application entry point
    ├── package.json
    └── .env                # Environment variables (not committed)
```

## Database Design

The database design diagram is included below. The editable diagram and its exported image are stored in the `ERD` folder.

![HelpDesk Pro Database ERD](./ERD/project3%20LasrDiagram.drawio.png)

Editable diagram: `ERD/Untitled project3 Diagram.drawio`

## API Route Groups

The Express application mounts the following route groups:

| Base Route | Purpose |
|---|---|
| `/auth` | Registration and sign-in |
| `/tickets` | Support ticket operations |
| `/comments` | Ticket comments |
| `/assets` | Asset inventory and borrowing workflow |
| `/users` | User and profile operations |
| `/departments` | Department operations |
| `/locations` | Office location operations |
| `/ai` | AI IT-support chat |
| `/uploads` | Access to uploaded files |

Most application routes require authentication. Access to some operations also depends on the user's role or ownership of the relevant record.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Google Gemini API key (for the AI Assistant feature)

### Installation

1. Open a terminal in the backend project folder (`Backend/auth-template-backend`).
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend project root. Configure the environment variables used by the project and database connection. The server reads `PORT`, `CLIENT_URL`, `GEMINI_API_KEY`, and `GEMINI_MODEL`; the MongoDB connection settings are read by `config/db.js`.
4. Start the backend using the script defined in `package.json` (for example, `npm run dev` if that script is configured).

The server uses port `3000` by default when `PORT` is not set. The default frontend origin for CORS is `http://localhost:5173`.

## Notes

- Keep `.env` and all API keys private. Do not commit credentials to GitHub.
- Uploaded images are served from the `/uploads` route.
- The AI chat endpoint requires an authenticated request and a valid Gemini API configuration.
