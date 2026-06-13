# WellBeing360 Setup and Run Guide

This guide explains how to set up and run the **WellBeing360** application on a new laptop or machine.

---

## Prerequisites

Before starting, ensure the new laptop has the following software installed:

1. **.NET 10 SDK**
   - Download the latest installer from [Microsoft's official .NET download page](https://dotnet.microsoft.com/download/dotnet/10.0).
   - Alternatively, install it using PowerShell script:
     ```powershell
     # Download the official installation script
     Invoke-WebRequest -Uri "https://dot.net/v1/dotnet-install.ps1" -OutFile "dotnet-install.ps1"
     
     # Install .NET 10 SDK
     .\dotnet-install.ps1 -Channel 10.0
     
     # Add the install location to your current environment PATH
     $env:PATH = "$env:LocalAppData\Microsoft\dotnet;" + $env:PATH
     ```

2. **SQL Server LocalDB**
   - LocalDB comes packaged with Visual Studio (under the *.NET Desktop Development* or *ASP.NET and Web Development* workload) or can be installed separately.
   - Alternatively, you can use a full instance of SQL Server or SQL Server Express. If you use a different SQL Server instance, update the connection string in [appsettings.json](file:///c:/Users/Test/OneDrive/Documents/Desktop/project/WellBeing360.API/appsettings.json).

3. **Node.js & npm**
   - Node.js (version 18 or newer) is required for the React frontend.
   - Download the installer from the [Node.js official website](https://nodejs.org/).

---

## Step 1: Database Setup

1. Verify that SQL Server LocalDB is running:
   ```cmd
   sqllocaldb info MSSQLLocalDB
   ```
2. If it is stopped or not created:
   ```cmd
   sqllocaldb create MSSQLLocalDB
   sqllocaldb start MSSQLLocalDB
   ```

---

## Step 2: Run the Backend (.NET 10 API)

1. Open your terminal and navigate to the project directory root.
2. Build the solution to restore packages and compile the code:
   ```cmd
   dotnet build
   ```
3. Run the API project using the `http` launch profile:
   ```cmd
   dotnet run --project WellBeing360.API --launch-profile "http"
   ```
   *The backend will boot up, automatically run EF Core migrations to build the tables in SQL LocalDB, seed mock data, and listen on `http://localhost:5201`.*

---

## Step 3: Run the Frontend (React + Vite)

1. Open a new terminal window.
2. Navigate to the frontend directory:
   ```cmd
   cd wellbeing360-ui
   ```
3. Install the npm packages:
   ```cmd
   npm install
   ```
4. Start the frontend developer server:
   ```cmd
   npm run dev
   ```
   *The React development server will start and print the local URL (usually `http://localhost:5173/`).*

---

## Step 4: Verification and Play

1. Open your browser and navigate to the frontend URL: `http://localhost:5173/`
2. You should see the premium, glassmorphic **WellBeing360 Benefits & Wellness Portal**.
3. Confirm that the default employee profile (**gopal**) loads successfully, meaning the UI is communicating with the .NET 10 API on port `5201`.
4. Switch roles using the **Act As** dropdown in the navigation header to explore other consoles:
   - **Employee** (Wellness logging, rewards, counselling bookings)
   - **HR Benefits Admin** (Flex buckets, plan configurations)
   - **Finance Executive** (Analytics reports, employer premium calculations)
   - **Admin** (Compliance audit logs pulled from the database)

---

## Step 5: Testing the Backend with Postman

### 1. Register a New User
- **Method**: `POST`
- **URL**: `http://localhost:5201/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body (JSON Raw)**:
  ```json
  {
    "Name": "Gopal",
    "Email": "gopal@example.com",
    "Password": "securepassword",
    "Phone": "1234567890",
    "Role": "Employee",
    "GradeID": "G2",
    "DepartmentID": "IT"
  }
  ```
- **Expected Response**: `201 Created` containing registration confirmation and a newly generated unique employee ID (e.g., `EMP8733`).

---

### 2. Login to Generate JWT Token
- **Method**: `POST`
- **URL**: `http://localhost:5201/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body (JSON Raw)**:
  ```json
  {
    "Email": "gopal@example.com",
    "Password": "securepassword"
  }
  ```
- **Expected Response**: `200 OK` containing a real, cryptographically signed **JWT token** containing user claims, along with user profile information.

---

### 3. Retrieve All Users
- **Method**: `GET`
- **URL**: `http://localhost:5201/api/users`
- **Expected Response**: List of all user accounts (including your newly registered user).

---

### 4. Log a Wellness Activity
- **Method**: `POST`
- **URL**: `http://localhost:5201/api/wellness/log-activity`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-User-Id`: `7` (Use your registered UserID)
- **Body (JSON Raw)**:
  ```json
  {
    "challengeId": 1,
    "activityValue": 10000,
    "logDate": "2026-06-07"
  }
  ```
- **Expected Response**: Activity log details showing points earned.

---

### 5. Book an Employee Assistance Program (EAP) Session
- **Method**: `POST`
- **URL**: `http://localhost:5201/api/eap/book`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-User-Id`: `7`
- **Body (JSON Raw)**:
  ```json
  {
    "serviceId": 1,
    "requestedDate": "2026-06-15T10:00:00"
  }
  ```
- **Expected Response**: Confirmation of the booked session details with a "Requested" status.


