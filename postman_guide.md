# WellBeing360: Postman API Reference Guide

This guide explains the 8 core modules of the **WellBeing360** application and provides exact instructions, header configurations, and sample JSON payloads for accessing each module's APIs in **Postman**.

---

## 1. Global Setup Instructions

* **Base URL**: All endpoint paths are prefixed with `http://localhost:5201/api/`.
* **JWT Authorization**:
  * Most endpoints are protected with C# `[Authorize]` attributes.
  * To call protected endpoints, you must first call `POST /api/auth/login` (see credentials below) to receive a JSON Web Token (JWT).
  * In Postman, go to the **Authorization** tab of your folder or request, select **Bearer Token** from the Type dropdown, and paste the returned token.
* **Employee Context Identification Header (`X-User-Id`)**:
  * For endpoints that run in the context of a specific employee (like submitting wellness logs, viewing enrolled benefits, adding dependents, or booking EAP counseling), the backend identifies the user using the custom header `X-User-Id`.
  * Pass `X-User-Id` in the headers with the value of the targeted employee's database ID (e.g. `1` for `gopal`).

---

## 2. Seeded Test Accounts & Roles

The database seeds 20 distinct users across different roles, grades, and departments. Use these to generate JWT tokens for different testing scenarios:

| User ID | Name | Email | Password | Role / Persona | Grade | Department |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **gopal** | `employee@wellbeing360.com` | `password` | **Employee** | G3 | IT |
| **2** | **dharshan** | `hrbenefits@wellbeing360.com` | `password` | **HRBenefitsAdmin** | G4 | HR |
| **3** | **Vignesh** | `finance@wellbeing360.com` | `password` | **Finance** | G4 | Finance |
| **4** | **Nishanth** | `wellness@wellbeing360.com` | `password` | **WellnessCoordinator** | G3 | HR |
| **5** | **pradeep** | `recognition@wellbeing360.com` | `password` | **RecognitionManager** | G3 | HR |
| **6** | **Madhav** | `admin@wellbeing360.com` | `password` | **Admin** | G5 | Executive |
| **7** | **arun** | `arun@wellbeing360.com` | `password` | **Employee** | G1 | Operations |
| **8** | **balaji** | `balaji@wellbeing360.com` | `password` | **Employee** | G2 | Sales |
| **9** | **chandru** | `chandru@wellbeing360.com` | `password` | **Employee** | G3 | Marketing |
| **10** | **divya** | `divya@wellbeing360.com` | `password` | **Employee** | G4 | R&D |
| **11** | **eshwar** | `eshwar@wellbeing360.com` | `password` | **Employee** | G5 | Legal |
| **12** | **faisal** | `faisal@wellbeing360.com` | `password` | **Employee** | G2 | IT |
| **13** | **gowri** | `gowri@wellbeing360.com` | `password` | **Employee** | G1 | HR |
| **14** | **hari** | `hari@wellbeing360.com` | `password` | **Employee** | G3 | Finance |
| **15** | **indhu** | `indhu@wellbeing360.com` | `password` | **Employee** | G4 | IT |
| **16** | **jeeva** | `jeeva@wellbeing360.com` | `password` | **Employee** | G3 | Operations |
| **17** | **kavitha** | `kavitha@wellbeing360.com` | `password` | **Employee** | G2 | Sales |
| **18** | **lokesh** | `lokesh@wellbeing360.com` | `password` | **Employee** | G4 | Marketing |
| **19** | **meena** | `meena@wellbeing360.com` | `password` | **Employee** | G5 | R&D |
| **20** | **naveen** | `naveen@wellbeing360.com` | `password` | **Employee** | G1 | IT |

---

## 3. The 8 Modules & API Reference

### Module 1: Authentication & User Management
* **Purpose**: Manages user registration, authentication, JWT token signature and validation, and user profile management.
* **Key Tables**: `User`

#### A. Login (Generate JWT Token)
* **Method & URL**: `POST http://localhost:5201/api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "email": "employee@wellbeing360.com",
    "password": "password"
  }
  ```
* **Expected Response**: `200 OK` containing user info and a cryptographically signed JWT token under `"token"`.

#### B. Register New User (Anonymous Signup)
* **Method & URL**: `POST http://localhost:5201/api/auth/register`
* **Headers**: `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "Name": "Karthik Raja",
    "Email": "karthik@example.com",
    "Password": "securepassword",
    "Phone": "+91-98765-43210",
    "Role": "Employee",
    "GradeID": "G2",
    "DepartmentID": "IT"
  }
  ```
* **Expected Response**: `201 Created` confirmation with their generated Employee ID (e.g. `EMP1007`).

#### C. Get All Users
* **Method & URL**: `GET http://localhost:5201/api/users`
* **Headers**: 
  * `Authorization: Bearer <Admin_or_HRBenefitsAdmin_Token>`
* **Expected Response**: `200 OK` array of all user accounts.

---

### Module 2: Benefit Plans Configuration
* **Purpose**: Allows benefits administrators to define standard insurance policies and configure flex allowance buckets.
* **Key Tables**: `BenefitPlan`, `FlexBenefitBucket`

#### A. Get All Benefit Plans
* **Method & URL**: `GET http://localhost:5201/api/benefitplans`
* **Headers**:
  * `Authorization: Bearer <token>`
* **Expected Response**: `200 OK` array of active benefit plans.

#### B. Get Flex Buckets under a Plan
* **Method & URL**: `GET http://localhost:5201/api/benefitplans/4/buckets` *(where 4 is the flexible plan ID)*
* **Headers**:
  * `Authorization: Bearer <token>`

#### C. Create New Benefit Plan
* **Method & URL**: `POST http://localhost:5201/api/benefitplans`
* **Headers**:
  * `Authorization: Bearer <dharshan_Token>`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "PlanName": "Platinum Health Care",
    "PlanType": "GroupHealthInsurance",
    "EligibilityGrade": "G4,G5",
    "EmployeeContribution": 200,
    "EmployerContribution": 800,
    "CoverageLimit": 25000,
    "EffectiveDate": "2026-06-13",
    "Status": "Active"
  }
  ```
* **Expected Response**: `201 Created` details of the configured benefit plan.

---

### Module 3: Benefits Enrollment & Dependent Management
* **Purpose**: Coordinates enrollment calendars, handles employee benefit sign-ups, and manages eligible family dependents.
* **Key Tables**: `EnrolmentWindow`, `BenefitEnrolment`, `Dependent`

#### A. Get Current Open Enrollment Window
* **Method & URL**: `GET http://localhost:5201/api/enrolments/windows/current`
* **Headers**:
  * `Authorization: Bearer <token>`

#### B. Enroll in a Benefit Plan
* **Method & URL**: `POST http://localhost:5201/api/enrolments/enrol`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "planId": 2,
    "coverageOption": "EmployeeOnly",
    "dependents": []
  }
  ```
* **Expected Response**: `200 OK` detailing the enrollment and calculated payroll deductions.

#### C. Add a Dependent
* **Method & URL**: `POST http://localhost:5201/api/enrolments/my-dependents`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "name": "xyz",
    "relationship": "Spouse",
    "dateOfBirth": "1994-08-15"
  }
  ```
* **Expected Response**: `200 OK` detailing the created dependent.

---

### Module 4: Wellness Programs & Activity Tracking
* **Purpose**: Sets up fitness challenges and logs employee accomplishments to calculate and update reward points.
* **Key Tables**: `WellnessProgram`, `WellnessChallenge`, `ActivityLog`

#### A. Log Wellness Activity (Earn Points)
* **Method & URL**: `POST http://localhost:5201/api/wellness/log-activity`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "challengeId": 1,
    "activityValue": 10000,
    "logDate": "2026-06-13"
  }
  ```
* **Expected Response**: `200 OK` activity log confirmation containing `"pointsEarned": 100`.

#### B. Get Program Leaderboard
* **Method & URL**: `GET http://localhost:5201/api/wellness/programs/1/leaderboard`
* **Headers**:
  * `Authorization: Bearer <token>`

---

### Module 5: Employee Assistance Program (EAP)
* **Purpose**: Provides employees private advisory channels for financial planning, mental health, and legal advice.
* **Key Tables**: `EAPService`, `EAPSession`

#### A. Get EAP Services List
* **Method & URL**: `GET http://localhost:5201/api/eap/services`
* **Headers**:
  * `Authorization: Bearer <token>`

#### B. Book counseling session
* **Method & URL**: `POST http://localhost:5201/api/eap/book`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "serviceId": 1,
    "requestedDate": "2026-06-20T14:30:00"
  }
  ```
* **Expected Response**: `200 OK` session details with status `"Requested"`.

#### C. Approve Booking & Assign Counselor
* **Method & URL**: `PUT http://localhost:5201/api/eap/sessions/1/status` *(where 1 is the SessionID)*
* **Headers**:
  * `Authorization: Bearer <Nishanth_or_dharshan_Token>`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "status": "Scheduled",
    "counsellorRef": "Dr. Aditi Sharma"
  }
  ```
* **Expected Response**: `200 OK` detailing the updated EAP session.

---

### Module 6: Recognition & Rewards
* **Purpose**: Encourages healthy company culture through peer-to-peer nominations and reward catalog redemptions.
* **Key Tables**: `RecognitionAward`, `RewardPoints`, `RedemptionCatalog`

#### A. Nominate a Peer for an Award
* **Method & URL**: `POST http://localhost:5201/api/recognition/nominate`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "recipientId": 2,
    "category": "PeerRecognition",
    "badgeName": "Customer Centricity",
    "pointsAwarded": 100,
    "message": "Thanks for helping resolve the deployment issues so fast!"
  }
  ```

#### B. Get Current Reward Points Balance
* **Method & URL**: `GET http://localhost:5201/api/recognition/my-points`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`

#### C. Redeem Catalog Item
* **Method & URL**: `POST http://localhost:5201/api/recognition/redeem`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`
  * `Content-Type: application/json`
* **Request Body (JSON)**:
  ```json
  {
    "itemId": 1
  }
  ```

---

### Module 7: Reports & Compliance Audit
* **Purpose**: Provides company-wide analytics to finance boards and monitors compliance actions via automated logs.
* **Key Tables**: `BenefitsReport`, `AuditLog`

#### A. Generate Company Utilization Report
* **Method & URL**: `POST http://localhost:5201/api/reports/generate?scope=Company`
* **Headers**:
  * `Authorization: Bearer <Vignesh_Token>`
* **Expected Response**: `200 OK` with serialized metrics.

#### B. Get Compliance Audit Logs
* **Method & URL**: `GET http://localhost:5201/api/reports/audit`
* **Headers**:
  * `Authorization: Bearer <Madhav_Token>`
* **Expected Response**: `200 OK` list of all user actions intercepted by the middleware.

---

### Module 8: Notifications
* **Purpose**: Pushes alerts regarding open enrollments, wellness completions, and recognition awards to users.
* **Key Tables**: `Notification`

#### A. Get My Notifications
* **Method & URL**: `GET http://localhost:5201/api/notifications`
* **Headers**:
  * `Authorization: Bearer <gopal_Token>`
  * `X-User-Id: 1`

#### B. Mark Notification as Read
* **Method & URL**: `PUT http://localhost:5201/api/notifications/1/read` *(where 1 is the NotificationID)*
* **Headers**:
  * `Authorization: Bearer <token>`
