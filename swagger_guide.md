# WellBeing360: Swagger UI API Reference Guide

This guide explains how to access, authenticate, and test the 8 core modules of the **WellBeing360** application using **Swagger UI**.

---

## 1. Accessing Swagger UI

1. Run the backend API project (e.g., using `dotnet run --project WellBeing360.API --launch-profile "http"`).
2. Open your web browser and navigate to:
   * **URL**: `http://localhost:5201/swagger/index.html`
3. You will see the interactive **WellBeing360 API** documentation page.

---

## 2. Authentication Setup in Swagger

Unlike Postman, Swagger UI has a built-in **Authorize** utility and automatic middleware mapping. Here is how to configure it:

### Step A: Generate a JWT Token
1. In the Swagger UI list, expand the **Auth** section.
2. Select `POST /api/auth/login`.
3. Click the **Try it out** button on the right.
4. Replace the email in the request body with one of the seeded accounts (e.g. `employee@wellbeing360.com` / `password`).
5. Click **Execute**.
6. Copy the `"token"` string (without quotes) from the Response Body.

### Step B: Apply the Token globally
1. Scroll to the top of the Swagger page and click the **Authorize** button (green padlock icon).
2. In the text box, type:
   * `Bearer <your_copied_token>` (replace `<your_copied_token>` with the actual JWT string).
3. Click **Authorize** and then **Close**.
4. You are now authenticated globally! The padlock icons next to the remaining endpoints will show as locked.

---

## 3. Automatic Employee Context (`X-User-Id`)

The backend API includes a custom middleware (`Program.cs`) that handles user session mapping:
* When you call any endpoint in Swagger with a valid Bearer token, the API intercepts the request, reads the `NameIdentifier` claim inside your token, and **automatically injects the corresponding `X-User-Id` header**.
* **You do not need to manually specify the `X-User-Id` header** inside Swagger. The middleware takes care of it based on whoever you logged in as.

---

## 4. Endpoints & Seeded Parameters by Module

Below is a map of the 8 modules in Swagger. To run any endpoint:
1. Click to expand the target route.
2. Click **Try it out**.
3. Supply the parameters/body.
4. Click **Execute** to view responses.

---

### Module 1: Authentication & User Management
* **`POST /api/auth/login`**: Authenticate and generate JWT tokens.
* **`POST /api/auth/register`**: Register new employee user profiles.
* **`GET /api/users/{id}`**: Fetch user details.
* **`PUT /api/users/{id}`**: Update user profile status.

---

### Module 2: Benefit Plans Configuration
* **`GET /api/benefitplans`**: Fetches all active plans.
* **`GET /api/benefitplans/{id}/buckets`**: Fetches flexible benefit buckets (Medical, Childcare, Fitness, Education) under a flex plan (ID `4`).
* **`POST /api/benefitplans`**: Restricts plan configuration to `HRBenefitsAdmin` or `Admin` roles.

---

### Module 3: Benefits Enrollment & Dependent Management
* **`GET /api/enrolments/windows/current`**: Fetches the active enrollment period.
* **`POST /api/enrolments/enrol`**: Enrolls the active user (based on your active JWT context) in a plan.
* **`POST /api/enrolments/my-dependents`**: Adds a family member to your profile.
  * *Request Body*:
    ```json
    {
      "name": "xyz",
      "relationship": "Spouse",
      "dateOfBirth": "1994-08-15"
    }
    ```

---

### Module 4: Wellness Programs & Activity Tracking
* **`GET /api/wellness/programs/{programId}/challenges`**: List challenges (e.g. 10K Steps Challenge) under a program.
* **`POST /api/wellness/log-activity`**: Submit active values to earn reward points.
  * *Request Body*:
    ```json
    {
      "challengeId": 1,
      "activityValue": 10000,
      "logDate": "2026-06-13T00:00:00Z"
    }
    ```
* **`GET /api/wellness/programs/{programId}/leaderboard`**: View user point rankings.

---

### Module 5: Employee Assistance Program (EAP)
* **`GET /api/eap/services`**: List professional counseling services.
* **`POST /api/eap/book`**: Request private mental health, financial, or legal advice sessions.
* **`PUT /api/eap/sessions/{id}/status`**: Update session details and assign a counselor (accessible by `WellnessCoordinator` or `HRBenefitsAdmin`).
  * *Request Body*:
    ```json
    {
      "status": "Scheduled",
      "counsellorRef": "Dr. Aditi Sharma"
    }
    ```

---

### Module 6: Recognition & Rewards
* **`POST /api/recognition/nominate`**: Reward points and nominate colleagues for badges.
  * *Request Body*:
    ```json
    {
      "recipientId": 2,
      "category": "PeerRecognition",
      "badgeName": "Customer Centricity",
      "pointsAwarded": 100,
      "message": "Thanks for help resolving the deployment issues so fast!"
    }
    ```
* **`GET /api/recognition/my-points`**: Check points balance.
* **`POST /api/recognition/redeem`**: Purchase items from the catalog.

---

### Module 7: Reports & Compliance Audit
* **`POST /api/reports/generate`**: Generates company-wide coverage stats (restricted to `Finance` or `Admin`).
* **`GET /api/reports/audit`**: Fetches raw middleware audit logs (restricted to `Admin` only).

---

### Module 8: Notifications
* **`GET /api/notifications`**: Checks active notifications.
* **`PUT /api/notifications/{id}/read`**: Mark specific alerts as read.
