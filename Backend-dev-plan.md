# Backend Development Plan: Mood Journal

### 1️⃣ Executive Summary
- This document outlines the development plan for a FastAPI backend to support the Mood Journal frontend.
- The backend will be built using Python 3.13 and will use MongoDB Atlas as the database via the Motor async driver.
- Development will follow a set of constraints: no Docker, mandatory manual testing after each task, and a single `main` branch for version control.
- The project will be broken down into a dynamic number of sprints, starting with environment setup (S0) and followed by feature-specific sprints.

### 2️⃣ In-Scope & Success Criteria
- **In-Scope Features:**
  - User authentication (signup, login, logout).
  - Create and update daily mood records.
  - Add emoji entries to a specific day's record.
  - Fetch all mood records for the timeline view.
- **Success Criteria:**
  - All frontend features are fully functional and connected to the live backend.
  - All manual test steps outlined in the tasks pass successfully.
  - Each sprint's code is committed and pushed to the `main` branch after successful testing.

### 3️⃣ API Design
- **Base Path:** `/api/v1`
- **Error Envelope:** `{ "error": "message" }`
- **Endpoints:**
  - **`POST /api/v1/auth/signup`**
    - **Purpose:** Register a new user.
    - **Request:** `{ "email": "user@example.com", "password": "password123" }`
    - **Response:** `{ "token": "jwt_token" }`
    - **Validation:** Email must be valid and unique. Password must be at least 8 characters.
  - **`POST /api/v1/auth/login`**
    - **Purpose:** Authenticate a user and issue a JWT.
    - **Request:** `{ "email": "user@example.com", "password": "password123" }`
    - **Response:** `{ "token": "jwt_token" }`
    - **Validation:** Credentials must match a user in the database.
  - **`POST /api/v1/auth/logout`**
    - **Purpose:** Invalidate user session (client-side token removal).
    - **Request:** (None)
    - **Response:** `{ "message": "Logged out successfully" }`
  - **`GET /api/v1/moods`**
    - **Purpose:** Fetch all mood records for the authenticated user.
    - **Request:** (None, JWT in header)
    - **Response:** `[{ "date": "YYYY-MM-DD", "selectedMood": "happy", "emojiEntries": [{"emoji": "😊", "timestamp": "ISO_string"}] }]`
  - **`POST /api/v1/moods`**
    - **Purpose:** Create or update a mood record for the current day.
    - **Request:** `{ "selectedMood": "happy", "emoji": "😊" }` (either field is optional)
    - **Response:** The created or updated daily mood record object.
    - **Validation:** `selectedMood` must be a valid mood option. `emoji` must be a single emoji character.

### 4️⃣ Data Model (MongoDB Atlas)
- **`users` collection:**
  - `email`: String, required, unique
  - `password`: String, required (will be stored hashed)
  - **Example:** `{ "email": "test@example.com", "password": "hashed_password_string" }`
- **`mood_records` collection:**
  - `userId`: ObjectId, required, ref: 'users'
  - `date`: String, required, "YYYY-MM-DD" format
  - `selectedMood`: String, optional
  - `emojiEntries`: Array of embedded documents
    - `emoji`: String, required
    - `timestamp`: String, required (ISO 8601 format)
  - **Example:**
    ```json
    {
      "userId": "60d5ecb3a3a8a1e6b6f8e1c5",
      "date": "2025-10-26",
      "selectedMood": "happy",
      "emojiEntries": [
        { "emoji": "😊", "timestamp": "2025-10-26T10:00:00Z" },
        { "emoji": "🎉", "timestamp": "2025-10-26T15:30:00Z" }
      ]
    }
    ```

### 5️⃣ Frontend Audit & Feature Map
- **`Index` Page (`/`)**
  - **Purpose:** Main interface for mood tracking.
  - **Data Needed:** List of all past mood records.
  - **Endpoints:** `GET /api/v1/moods`, `POST /api/v1/moods`
  - **Models:** `mood_records`
  - **Auth:** Required.
- **`MoodSelector` Component**
  - **Purpose:** Select the overall mood for the day.
  - **Endpoints:** `POST /api/v1/moods` (sends `selectedMood`)
  - **Models:** `mood_records`
  - **Auth:** Required.
- **`EmojiInput` Component**
  - **Purpose:** Add an emoji entry for the day.
  - **Endpoints:** `POST /api/v1/moods` (sends `emoji`)
  - **Models:** `mood_records`
  - **Auth:** Required.
- **`MoodTimeline` Component**
  - **Purpose:** Display history of all mood records.
  - **Endpoints:** `GET /api/v1/moods`
  - **Models:** `mood_records`
  - **Auth:** Required.

### 6️⃣ Configuration & ENV Vars
- `APP_ENV`: `development` or `production`
- `PORT`: `8000`
- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: `86400` (24 hours in seconds)
- `CORS_ORIGINS`: The frontend URL (e.g., `http://localhost:5173`).

### 7️⃣ Background Work
- None required for this version.

### 8️⃣ Integrations
- None required for this version.

### 9️⃣ Testing Strategy (Manual via Frontend)
- All testing will be performed manually through the frontend UI.
- Each task in the sprint plan includes a specific **Manual Test Step** and a **User Test Prompt**.
- After all tasks in a sprint are completed and tested, the code will be committed and pushed to the `main` branch.
- If any test fails, the issue must be fixed and re-tested before pushing.

### 🔟 Dynamic Sprint Plan & Backlog

---

### S0 – Environment Setup & Frontend Connection

- **Objectives:**
  - Create a basic FastAPI application with `/api/v1` base path and a `/healthz` endpoint.
  - Establish a connection to MongoDB Atlas using the `MONGODB_URI`.
  - Implement the `/healthz` endpoint to perform a database ping.
  - Configure CORS to allow requests from the frontend.
  - Update the frontend to use the real backend URL.
  - Initialize a Git repository, set the default branch to `main`, and create a `.gitignore` file.
- **Definition of Done:**
  - The backend runs locally and successfully connects to MongoDB Atlas.
  - The `/healthz` endpoint returns a success status.
  - The frontend can successfully make requests to the backend.
  - The initial project structure is pushed to the `main` branch on GitHub.
- **Manual Test Step:**
  - Run the backend server. Open the browser's developer tools on the frontend, go to the Network tab, and verify that a request to `/healthz` returns a 200 OK status with a successful database connection message.
- **User Test Prompt:**
  > "Start the backend server and refresh the frontend application. Check the browser's developer console to confirm there are no CORS errors and the app loads without issues."

---

### S1 – Basic Auth (Signup / Login / Logout)

- **Objectives:**
  - Implement JWT-based user authentication with signup, login, and logout functionality.
  - Protect the mood-related endpoints, allowing access only to authenticated users.
- **User Stories:**
  - As a user, I want to sign up for a new account so I can start tracking my mood.
  - As a user, I want to log in to my account to access my mood history.
  - As a user, I want to log out to secure my account.
- **Tasks:**
  - **1. Implement User Model and Signup:**
    - Create the `users` collection model.
    - Implement the `POST /api/v1/auth/signup` endpoint with password hashing (Argon2).
    - **Manual Test Step:** Use a UI or API client to send a signup request. Verify that a new user is created in the database with a hashed password.
    - **User Test Prompt:** > "Create a new user account through the signup form and confirm you receive a success message."
  - **2. Implement Login:**
    - Implement the `POST /api/v1/auth/login` endpoint to verify credentials and issue a JWT.
    - **Manual Test Step:** Log in with the newly created user. Verify that a JWT is returned and can be stored on the client.
    - **User Test Prompt:** > "Log in with your new account. Confirm you are redirected to the main journal page."
  - **3. Implement Logout and Route Protection:**
    - Implement the `POST /api/v1/auth/logout` endpoint (client-side token clearing).
    - Add authentication middleware to protect the `/api/v1/moods` endpoints.
    - **Manual Test Step:** After logging in, try to access the mood timeline. Then, log out and try to access it again. Verify that access is denied after logout.
    - **User Test Prompt:** > "After logging out, try to refresh a protected page. You should be redirected to the login page."
- **Definition of Done:**
  - The full authentication flow (signup, login, logout) is functional from the frontend.
  - Mood-related API routes are protected and inaccessible to unauthenticated users.
- **Post-sprint:** Commit and push all changes to the `main` branch.

---

### S2 – Mood Tracking Core Features

- **Objectives:**
  - Implement the core functionality for creating, updating, and fetching mood records.
- **User Stories:**
  - As a user, I want to select my mood for the day so I can log my emotional state.
  - As a user, I want to add emoji entries throughout the day to capture specific feelings.
  - As a user, I want to see a timeline of all my past mood entries.
- **Tasks:**
  - **1. Fetch Mood Records:**
    - Implement the `GET /api/v1/moods` endpoint to return all mood records for the authenticated user, sorted by date descending.
    - **Manual Test Step:** After logging in, the frontend should call this endpoint. Verify that the timeline displays any existing mood data correctly or shows an empty state.
    - **User Test Prompt:** > "Log in and check the mood history section. It should display your mood records or an empty message if you have none."
  - **2. Create/Update Mood and Emoji Entries:**
    - Implement the `POST /api/v1/moods` endpoint. This endpoint should handle both creating a new record for the day and updating an existing one (e.g., adding a new emoji or changing the selected mood).
    - **Manual Test Step:** Use the UI to select a mood for the day. Then, add an emoji. Verify that the database record for the current day is created and then updated correctly.
    - **User Test Prompt:** > "Select a mood for today. Then, add an emoji. Refresh the page and confirm that both your selected mood and the emoji are displayed correctly in the timeline for today."
- **Definition of Done:**
  - Users can select a daily mood and add multiple emoji entries.
  - The mood timeline correctly displays all records for the logged-in user.
- **Post-sprint:** Commit and push all changes to the `main` branch.