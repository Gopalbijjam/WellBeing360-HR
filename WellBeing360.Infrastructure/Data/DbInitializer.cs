using System;
using System.Collections.Generic;
using System.Linq;
using WellBeing360.Core.Entities;

namespace WellBeing360.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static void Initialize(WellBeingContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // 1. Seed Users
            var users = new List<User>
            {
                new User { Name = "gopal", EmployeeID = "EMP1001", Email = "employee@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G3", DepartmentID = "IT", Phone = "+91-98400-11001", Status = "Active" },
                new User { Name = "dharshan", EmployeeID = "EMP1002", Email = "hrbenefits@wellbeing360.com", Password = "password", Role = "HRBenefitsAdmin", GradeID = "G4", DepartmentID = "HR", Phone = "+91-98400-11002", Status = "Active" },
                new User { Name = "Vignesh", EmployeeID = "EMP1003", Email = "finance@wellbeing360.com", Password = "password", Role = "Finance", GradeID = "G4", DepartmentID = "Finance", Phone = "+91-98400-11003", Status = "Active" },
                new User { Name = "Nishanth", EmployeeID = "EMP1004", Email = "wellness@wellbeing360.com", Password = "password", Role = "WellnessCoordinator", GradeID = "G3", DepartmentID = "HR", Phone = "+91-98400-11004", Status = "Active" },
                new User { Name = "pradeep", EmployeeID = "EMP1005", Email = "recognition@wellbeing360.com", Password = "password", Role = "RecognitionManager", GradeID = "G3", DepartmentID = "HR", Phone = "+91-98400-11005", Status = "Active" },
                new User { Name = "Madhav", EmployeeID = "EMP1006", Email = "admin@wellbeing360.com", Password = "password", Role = "Admin", GradeID = "G5", DepartmentID = "Executive", Phone = "+91-98400-11006", Status = "Active" }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            var employee = context.Users.First(u => u.Role == "Employee");
            var admin = context.Users.First(u => u.Role == "Admin");
            var manager = context.Users.First(u => u.Role == "RecognitionManager");
            var benefitsAdmin = context.Users.First(u => u.Role == "HRBenefitsAdmin");

            // 2. Seed Benefit Plans
            var plans = new List<BenefitPlan>
            {
                new BenefitPlan { PlanName = "Gold Health Insurance", PlanType = "GroupHealthInsurance", EligibilityGrade = "G3,G4,G5", EmployeeContribution = 100, EmployerContribution = 400, CoverageLimit = 15000, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Silver Health Insurance", PlanType = "GroupHealthInsurance", EligibilityGrade = "G1,G2,G3", EmployeeContribution = 50, EmployerContribution = 250, CoverageLimit = 8000, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Basic Dental & Vision", PlanType = "DentalVision", EligibilityGrade = "G1,G2,G3,G4,G5", EmployeeContribution = 15, EmployerContribution = 45, CoverageLimit = 1500, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Flex Benefit Wellness Program", PlanType = "FlexibleBenefit", EligibilityGrade = "G2,G3,G4,G5", EmployeeContribution = 0, EmployerContribution = 1200, CoverageLimit = 1200, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" }
            };

            context.BenefitPlans.AddRange(plans);
            context.SaveChanges();

            // 3. Seed Flex Benefit Buckets
            var flexPlan = context.BenefitPlans.First(p => p.PlanType == "FlexibleBenefit");
            var buckets = new List<FlexBenefitBucket>
            {
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Medical", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Childcare", AnnualAllowance = 300, CarryForwardAllowed = false, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Fitness", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Education", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" }
            };

            context.FlexBenefitBuckets.AddRange(buckets);
            context.SaveChanges();

            // 4. Seed Enrolment Windows
            var windows = new List<EnrolmentWindow>
            {
                new EnrolmentWindow { PlanYear = DateTime.UtcNow.Year, OpenDate = DateTime.UtcNow.AddDays(-10), CloseDate = DateTime.UtcNow.AddDays(20), EligibleGrades = "G1,G2,G3,G4,G5", Status = "Open" }
            };

            context.EnrolmentWindows.AddRange(windows);
            context.SaveChanges();

            var openWindow = context.EnrolmentWindows.First(w => w.Status == "Open");

            // 5. Seed Wellness Programs
            var programs = new List<WellnessProgram>
            {
                new WellnessProgram { Name = "Active Spring 2026", Theme = "Fitness", StartDate = DateTime.UtcNow.AddDays(-15), EndDate = DateTime.UtcNow.AddDays(15), PointsOnOffer = 500, TargetParticipation = 80, Status = "Active" },
                new WellnessProgram { Name = "Mindful Summer 2026", Theme = "MentalHealth", StartDate = DateTime.UtcNow.AddDays(20), EndDate = DateTime.UtcNow.AddDays(50), PointsOnOffer = 300, TargetParticipation = 60, Status = "Upcoming" }
            };

            context.WellnessPrograms.AddRange(programs);
            context.SaveChanges();

            var activeProg = context.WellnessPrograms.First(p => p.Status == "Active");

            // 6. Seed Wellness Challenges
            var challenges = new List<WellnessChallenge>
            {
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "10K Steps Challenge", ActivityType = "Steps", DailyTarget = 10000, Duration = 7, PointsPerCompletion = 100, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Daily Meditation Sprint", ActivityType = "Meditation", DailyTarget = 15, Duration = 5, PointsPerCompletion = 50, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Water Hydration Log", ActivityType = "WaterIntake", DailyTarget = 8, Duration = 10, PointsPerCompletion = 75, Status = "Active" }
            };

            context.WellnessChallenges.AddRange(challenges);
            context.SaveChanges();

            var stepsChallenge = context.WellnessChallenges.First(c => c.ChallengeName == "10K Steps Challenge");

            // 7. Seed EAP Services
            var eapServices = new List<EAPService>
            {
                new EAPService { ServiceName = "Mental Health Counselling", Category = "MentalHealthCounselling", SessionsAllowedPerEmployee = 6, Status = "Active" },
                new EAPService { ServiceName = "Legal Consultation", Category = "LegalAdvisory", SessionsAllowedPerEmployee = 3, Status = "Active" },
                new EAPService { ServiceName = "Family Financial Planning", Category = "FinancialCounselling", SessionsAllowedPerEmployee = 4, Status = "Active" },
                new EAPService { ServiceName = "Grief & Bereavement Support", Category = "GriefSupport", SessionsAllowedPerEmployee = 6, Status = "Active" }
            };

            context.EAPServices.AddRange(eapServices);
            context.SaveChanges();

            // 8. Seed Redemption Catalog Items
            var catalogItems = new List<RedemptionCatalog>
            {
                new RedemptionCatalog { ItemName = "$50 Amazon Gift Card", Category = "Voucher", PointsRequired = 500, AvailableQuantity = 150, Status = "Available" },
                new RedemptionCatalog { ItemName = "Ergonomic Office Chair Cushion", Category = "Merchandise", PointsRequired = 1000, AvailableQuantity = 15, Status = "Available" },
                new RedemptionCatalog { ItemName = "Premium Gym Bag", Category = "Merchandise", PointsRequired = 800, AvailableQuantity = 30, Status = "Available" },
                new RedemptionCatalog { ItemName = "1-Hour Massage Session", Category = "Experience", PointsRequired = 1800, AvailableQuantity = 8, Status = "Available" },
                new RedemptionCatalog { ItemName = "$25 UNICEF Donation", Category = "Charity", PointsRequired = 250, AvailableQuantity = 9999, Status = "Available" }
            };

            context.RedemptionCatalogs.AddRange(catalogItems);
            context.SaveChanges();

            // 9. Seed Reward Points for gopal
            var rewardPoints = new List<RewardPoints>
            {
                new RewardPoints { EmployeeID = employee.UserID, TotalEarned = 750, TotalRedeemed = 250, Balance = 500, LastUpdated = DateTime.UtcNow }
            };
            context.RewardPoints.AddRange(rewardPoints);
            context.SaveChanges();

            // 10. Seed Benefit Enrolment for gopal
            var silverPlan = context.BenefitPlans.First(p => p.PlanName == "Silver Health Insurance");
            var enrolments = new List<BenefitEnrolment>
            {
                new BenefitEnrolment
                {
                    EmployeeID = employee.UserID,
                    PlanID = silverPlan.PlanID,
                    WindowID = openWindow.WindowID,
                    CoverageOption = "EmployeeOnly",
                    DependentsIncluded = false,
                    EmployeeContributionAmount = silverPlan.EmployeeContribution,
                    EffectiveDate = DateTime.UtcNow.Date.AddDays(-5),
                    Status = "Active"
                }
            };
            context.BenefitEnrolments.AddRange(enrolments);
            context.SaveChanges();

            // 11. Seed EAP Session
            var counselling = context.EAPServices.First(s => s.ServiceName == "Mental Health Counselling");
            var sessions = new List<EAPSession>
            {
                new EAPSession
                {
                    EmployeeID = employee.UserID,
                    ServiceID = counselling.ServiceID,
                    RequestedDate = DateTime.UtcNow.AddDays(-3),
                    SessionDate = DateTime.UtcNow.AddDays(2),
                    CounsellorRef = "Dr. Linda Carter",
                    Status = "Scheduled"
                }
            };
            context.EAPSessions.AddRange(sessions);
            context.SaveChanges();

            // 12. Seed Activity Logs
            var logs = new List<ActivityLog>
            {
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = employee.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 12500, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = employee.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10200, PointsEarned = 100, Status = "Verified" }
            };
            context.ActivityLogs.AddRange(logs);
            context.SaveChanges();

            // 13. Seed Recognition Awards
            var awards = new List<RecognitionAward>
            {
                new RecognitionAward
                {
                    NominatorID = manager.UserID,
                    RecipientID = employee.UserID,
                    Category = "PeerRecognition",
                    BadgeName = "Collaborator Champion",
                    PointsAwarded = 150,
                    Message = "Great job coordinating the deployment of the benefits API! Super helpful and professional.",
                    AwardDate = DateTime.UtcNow.AddDays(-4),
                    Status = "Awarded"
                }
            };
            context.RecognitionAwards.AddRange(awards);
            context.SaveChanges();

            // 14. Seed Notifications
            var notifications = new List<Notification>
            {
                new Notification { UserID = employee.UserID, Message = "Welcome to WellBeing360! The benefits open enrolment window is now open.", Category = "Enrolment", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = employee.UserID, Message = "Your 10K Steps Challenge activity log has been verified.", Category = "Wellness", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-2) },
                new Notification { UserID = employee.UserID, Message = "You received a new Recognition Award from pradeep!", Category = "Recognition", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-4) }
            };
            context.Notifications.AddRange(notifications);
            context.SaveChanges();

            // 15. Seed Audit Logs
            var auditLogs = new List<AuditLog>
            {
                new AuditLog { UserID = admin.UserID, Action = "Seed Database", Module = "System", Timestamp = DateTime.UtcNow.AddDays(-10) },
                new AuditLog { UserID = benefitsAdmin.UserID, Action = "Create Silver Health Plan", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-10) },
                new AuditLog { UserID = employee.UserID, Action = "Enroll in Silver Health Insurance", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-5) }
            };
            context.AuditLogs.AddRange(auditLogs);
            context.SaveChanges();

            // 16. Seed Dependents
            var dependents = new List<Dependent>
            {
                new Dependent { EmployeeID = employee.UserID, Name = "xyz", Relationship = "Spouse", DateOfBirth = new DateTime(1994, 8, 15), Status = "Active" }
            };
            context.Dependents.AddRange(dependents);
            context.SaveChanges();

            // 17. Seed Benefits Reports
            var reports = new List<BenefitsReport>
            {
                new BenefitsReport 
                { 
                    Scope = "Company", 
                    Metrics = "{\"EnrolmentRate\":100.00,\"PremiumCost\":250.00,\"ClaimsSubmitted\":1,\"WellnessParticipation\":2,\"EAPUtilisation\":1,\"RecognitionCount\":1,\"PointsRedeemed\":250.00,\"TotalEmployees\":1}", 
                    GeneratedDate = DateTime.UtcNow.AddDays(-1) 
                }
            };
            context.BenefitsReports.AddRange(reports);
            context.SaveChanges();
        }
    }
}
