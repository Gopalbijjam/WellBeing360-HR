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

            // 1. Seed 20 Users
            var users = new List<User>
            {
                new User { Name = "gopal", EmployeeID = "EMP1001", Email = "employee@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G3", DepartmentID = "IT", Phone = "+91-98400-11001", Status = "Active" },
                new User { Name = "dharshan", EmployeeID = "EMP1002", Email = "hrbenefits@wellbeing360.com", Password = "password", Role = "HRBenefitsAdmin", GradeID = "G4", DepartmentID = "HR", Phone = "+91-98400-11002", Status = "Active" },
                new User { Name = "Vignesh", EmployeeID = "EMP1003", Email = "finance@wellbeing360.com", Password = "password", Role = "Finance", GradeID = "G4", DepartmentID = "Finance", Phone = "+91-98400-11003", Status = "Active" },
                new User { Name = "Nishanth", EmployeeID = "EMP1004", Email = "wellness@wellbeing360.com", Password = "password", Role = "WellnessCoordinator", GradeID = "G3", DepartmentID = "HR", Phone = "+91-98400-11004", Status = "Active" },
                new User { Name = "pradeep", EmployeeID = "EMP1005", Email = "recognition@wellbeing360.com", Password = "password", Role = "RecognitionManager", GradeID = "G3", DepartmentID = "HR", Phone = "+91-98400-11005", Status = "Active" },
                new User { Name = "Madhav", EmployeeID = "EMP1006", Email = "admin@wellbeing360.com", Password = "password", Role = "Admin", GradeID = "G5", DepartmentID = "Executive", Phone = "+91-98400-11006", Status = "Active" },
                new User { Name = "arun", EmployeeID = "EMP1007", Email = "arun@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G1", DepartmentID = "Operations", Phone = "+91-98400-11007", Status = "Active" },
                new User { Name = "balaji", EmployeeID = "EMP1008", Email = "balaji@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G2", DepartmentID = "Sales", Phone = "+91-98400-11008", Status = "Active" },
                new User { Name = "chandru", EmployeeID = "EMP1009", Email = "chandru@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G3", DepartmentID = "Marketing", Phone = "+91-98400-11009", Status = "Active" },
                new User { Name = "divya", EmployeeID = "EMP1010", Email = "divya@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G4", DepartmentID = "R&D", Phone = "+91-98400-11010", Status = "Active" },
                new User { Name = "eshwar", EmployeeID = "EMP1011", Email = "eshwar@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G5", DepartmentID = "Legal", Phone = "+91-98400-11011", Status = "Active" },
                new User { Name = "faisal", EmployeeID = "EMP1012", Email = "faisal@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G2", DepartmentID = "IT", Phone = "+91-98400-11012", Status = "Active" },
                new User { Name = "gowri", EmployeeID = "EMP1013", Email = "gowri@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G1", DepartmentID = "HR", Phone = "+91-98400-11013", Status = "Active" },
                new User { Name = "hari", EmployeeID = "EMP1014", Email = "hari@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G3", DepartmentID = "Finance", Phone = "+91-98400-11014", Status = "Active" },
                new User { Name = "indhu", EmployeeID = "EMP1015", Email = "indhu@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G4", DepartmentID = "IT", Phone = "+91-98400-11015", Status = "Active" },
                new User { Name = "jeeva", EmployeeID = "EMP1016", Email = "jeeva@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G3", DepartmentID = "Operations", Phone = "+91-98400-11016", Status = "Active" },
                new User { Name = "kavitha", EmployeeID = "EMP1017", Email = "kavitha@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G2", DepartmentID = "Sales", Phone = "+91-98400-11017", Status = "Active" },
                new User { Name = "lokesh", EmployeeID = "EMP1018", Email = "lokesh@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G4", DepartmentID = "Marketing", Phone = "+91-98400-11018", Status = "Active" },
                new User { Name = "meena", EmployeeID = "EMP1019", Email = "meena@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G5", DepartmentID = "R&D", Phone = "+91-98400-11019", Status = "Active" },
                new User { Name = "naveen", EmployeeID = "EMP1020", Email = "naveen@wellbeing360.com", Password = "password", Role = "Employee", GradeID = "G1", DepartmentID = "IT", Phone = "+91-98400-11020", Status = "Active" }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            // Retrieve generated User entities to map relationships
            var dbUsers = context.Users.ToList();
            var gopal = dbUsers.First(u => u.Name == "gopal");
            var dharshan = dbUsers.First(u => u.Name == "dharshan");
            var vignesh = dbUsers.First(u => u.Name == "Vignesh");
            var nishanth = dbUsers.First(u => u.Name == "Nishanth");
            var pradeep = dbUsers.First(u => u.Name == "pradeep");
            var madhav = dbUsers.First(u => u.Name == "Madhav");
            var arun = dbUsers.First(u => u.Name == "arun");
            var balaji = dbUsers.First(u => u.Name == "balaji");
            var chandru = dbUsers.First(u => u.Name == "chandru");
            var divya = dbUsers.First(u => u.Name == "divya");
            var eshwar = dbUsers.First(u => u.Name == "eshwar");
            var faisal = dbUsers.First(u => u.Name == "faisal");
            var gowri = dbUsers.First(u => u.Name == "gowri");
            var hari = dbUsers.First(u => u.Name == "hari");
            var indhu = dbUsers.First(u => u.Name == "indhu");
            var jeeva = dbUsers.First(u => u.Name == "jeeva");
            var kavitha = dbUsers.First(u => u.Name == "kavitha");
            var lokesh = dbUsers.First(u => u.Name == "lokesh");
            var meena = dbUsers.First(u => u.Name == "meena");
            var naveen = dbUsers.First(u => u.Name == "naveen");

            // 2. Seed 5 Benefit Plans
            var plans = new List<BenefitPlan>
            {
                new BenefitPlan { PlanName = "Gold Health Insurance", PlanType = "GroupHealthInsurance", EligibilityGrade = "G3,G4,G5", EmployeeContribution = 100, EmployerContribution = 400, CoverageLimit = 15000, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Silver Health Insurance", PlanType = "GroupHealthInsurance", EligibilityGrade = "G1,G2,G3", EmployeeContribution = 50, EmployerContribution = 250, CoverageLimit = 8000, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Basic Dental & Vision", PlanType = "DentalVision", EligibilityGrade = "G1,G2,G3,G4,G5", EmployeeContribution = 15, EmployerContribution = 45, CoverageLimit = 1500, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Flex Benefit Wellness Program", PlanType = "FlexibleBenefit", EligibilityGrade = "G2,G3,G4,G5", EmployeeContribution = 0, EmployerContribution = 1200, CoverageLimit = 1200, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" },
                new BenefitPlan { PlanName = "Executive Life Cover", PlanType = "LifeCover", EligibilityGrade = "G4,G5", EmployeeContribution = 80, EmployerContribution = 320, CoverageLimit = 100000, EffectiveDate = DateTime.UtcNow.Date, Status = "Active" }
            };

            context.BenefitPlans.AddRange(plans);
            context.SaveChanges();

            var goldPlan = context.BenefitPlans.First(p => p.PlanName == "Gold Health Insurance");
            var silverPlan = context.BenefitPlans.First(p => p.PlanName == "Silver Health Insurance");
            var dentalPlan = context.BenefitPlans.First(p => p.PlanName == "Basic Dental & Vision");
            var flexPlan = context.BenefitPlans.First(p => p.PlanName == "Flex Benefit Wellness Program");
            var lifePlan = context.BenefitPlans.First(p => p.PlanName == "Executive Life Cover");

            // 3. Seed Flex Benefit Buckets
            var buckets = new List<FlexBenefitBucket>
            {
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Medical", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Childcare", AnnualAllowance = 300, CarryForwardAllowed = false, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Fitness", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" },
                new FlexBenefitBucket { PlanID = flexPlan.PlanID, BucketName = "Education", AnnualAllowance = 300, CarryForwardAllowed = true, Status = "Active" }
            };

            context.FlexBenefitBuckets.AddRange(buckets);
            context.SaveChanges();

            // 4. Seed 2 Enrolment Windows (one past, one current)
            var windows = new List<EnrolmentWindow>
            {
                new EnrolmentWindow { PlanYear = DateTime.UtcNow.Year - 1, OpenDate = DateTime.UtcNow.AddDays(-380), CloseDate = DateTime.UtcNow.AddDays(-350), EligibleGrades = "G1,G2,G3,G4,G5", Status = "Closed" },
                new EnrolmentWindow { PlanYear = DateTime.UtcNow.Year, OpenDate = DateTime.UtcNow.AddDays(-15), CloseDate = DateTime.UtcNow.AddDays(15), EligibleGrades = "G1,G2,G3,G4,G5", Status = "Open" }
            };

            context.EnrolmentWindows.AddRange(windows);
            context.SaveChanges();

            var openWindow = context.EnrolmentWindows.First(w => w.Status == "Open");
            var closedWindow = context.EnrolmentWindows.First(w => w.Status == "Closed");

            // 5. Seed 10 Benefit Enrolments
            var enrolments = new List<BenefitEnrolment>
            {
                new BenefitEnrolment { EmployeeID = gopal.UserID, PlanID = silverPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = silverPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = dharshan.UserID, PlanID = goldPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeSpouse", DependentsIncluded = true, EmployeeContributionAmount = goldPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = vignesh.UserID, PlanID = flexPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = flexPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = arun.UserID, PlanID = silverPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "Family", DependentsIncluded = true, EmployeeContributionAmount = silverPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = balaji.UserID, PlanID = dentalPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = dentalPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = chandru.UserID, PlanID = silverPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = silverPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = divya.UserID, PlanID = flexPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeSpouse", DependentsIncluded = true, EmployeeContributionAmount = flexPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = eshwar.UserID, PlanID = lifePlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = lifePlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = faisal.UserID, PlanID = dentalPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "Family", DependentsIncluded = true, EmployeeContributionAmount = dentalPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" },
                new BenefitEnrolment { EmployeeID = indhu.UserID, PlanID = goldPlan.PlanID, WindowID = openWindow.WindowID, CoverageOption = "EmployeeOnly", DependentsIncluded = false, EmployeeContributionAmount = goldPlan.EmployeeContribution, EffectiveDate = DateTime.UtcNow.Date.AddDays(1), Status = "Active" }
            };

            context.BenefitEnrolments.AddRange(enrolments);
            context.SaveChanges();

            // 6. Seed 12 Dependents
            var dependents = new List<Dependent>
            {
                new Dependent { EmployeeID = gopal.UserID, Name = "xyz", Relationship = "Spouse", DateOfBirth = new DateTime(1994, 8, 15), Status = "Active" },
                new Dependent { EmployeeID = gopal.UserID, Name = "Aryan", Relationship = "Child", DateOfBirth = new DateTime(2018, 5, 20), Status = "Active" },
                new Dependent { EmployeeID = dharshan.UserID, Name = "Sneha", Relationship = "Child", DateOfBirth = new DateTime(2015, 10, 12), Status = "Active" },
                new Dependent { EmployeeID = arun.UserID, Name = "Raman", Relationship = "Parent", DateOfBirth = new DateTime(1960, 4, 5), Status = "Active" },
                new Dependent { EmployeeID = divya.UserID, Name = "Rahul", Relationship = "Spouse", DateOfBirth = new DateTime(1990, 11, 22), Status = "Active" },
                new Dependent { EmployeeID = faisal.UserID, Name = "Zayan", Relationship = "Child", DateOfBirth = new DateTime(2020, 2, 14), Status = "Active" },
                new Dependent { EmployeeID = kavitha.UserID, Name = "Ravi", Relationship = "Spouse", DateOfBirth = new DateTime(1992, 7, 30), Status = "Active" },
                new Dependent { EmployeeID = meena.UserID, Name = "Sita", Relationship = "Parent", DateOfBirth = new DateTime(1965, 9, 18), Status = "Active" },
                new Dependent { EmployeeID = balaji.UserID, Name = "Kiran", Relationship = "Spouse", DateOfBirth = new DateTime(1995, 3, 11), Status = "Active" },
                new Dependent { EmployeeID = lokesh.UserID, Name = "Maya", Relationship = "Child", DateOfBirth = new DateTime(2021, 6, 8), Status = "Active" },
                new Dependent { EmployeeID = jeeva.UserID, Name = "Kala", Relationship = "Parent", DateOfBirth = new DateTime(1962, 1, 25), Status = "Active" },
                new Dependent { EmployeeID = naveen.UserID, Name = "Oviya", Relationship = "Spouse", DateOfBirth = new DateTime(1997, 12, 5), Status = "Active" }
            };

            context.Dependents.AddRange(dependents);
            context.SaveChanges();

            // 7. Seed 3 Wellness Programs
            var programs = new List<WellnessProgram>
            {
                new WellnessProgram { Name = "Active Spring 2026", Theme = "Fitness", StartDate = DateTime.UtcNow.AddDays(-15), EndDate = DateTime.UtcNow.AddDays(15), PointsOnOffer = 500, TargetParticipation = 80, Status = "Active" },
                new WellnessProgram { Name = "Mindful Summer 2026", Theme = "MentalHealth", StartDate = DateTime.UtcNow.AddDays(20), EndDate = DateTime.UtcNow.AddDays(50), PointsOnOffer = 300, TargetParticipation = 60, Status = "Upcoming" },
                new WellnessProgram { Name = "Health & Nutrition 2025", Theme = "Nutrition", StartDate = DateTime.UtcNow.AddDays(-200), EndDate = DateTime.UtcNow.AddDays(-180), PointsOnOffer = 400, TargetParticipation = 75, Status = "Completed" }
            };

            context.WellnessPrograms.AddRange(programs);
            context.SaveChanges();

            var activeProg = context.WellnessPrograms.First(p => p.Status == "Active");

            // 8. Seed 8 Wellness Challenges
            var challenges = new List<WellnessChallenge>
            {
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "10K Steps Challenge", ActivityType = "Steps", DailyTarget = 10000, Duration = 7, PointsPerCompletion = 100, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Daily Meditation Sprint", ActivityType = "Meditation", DailyTarget = 15, Duration = 5, PointsPerCompletion = 50, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Water Hydration Log", ActivityType = "WaterIntake", DailyTarget = 8, Duration = 10, PointsPerCompletion = 75, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Push-up Marathon", ActivityType = "Gym", DailyTarget = 50, Duration = 10, PointsPerCompletion = 150, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Bike to Work", ActivityType = "Cycling", DailyTarget = 10, Duration = 5, PointsPerCompletion = 120, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Sleep Tracker Goals", ActivityType = "Sleep", DailyTarget = 8, Duration = 7, PointsPerCompletion = 80, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Active Cardio Kick", ActivityType = "Cardio", DailyTarget = 30, Duration = 5, PointsPerCompletion = 110, Status = "Active" },
                new WellnessChallenge { ProgramID = activeProg.ProgramID, ChallengeName = "Sugar Free Week", ActivityType = "Diet", DailyTarget = 1, Duration = 7, PointsPerCompletion = 130, Status = "Active" }
            };

            context.WellnessChallenges.AddRange(challenges);
            context.SaveChanges();

            var stepsChallenge = context.WellnessChallenges.First(c => c.ChallengeName == "10K Steps Challenge");
            var meditationChallenge = context.WellnessChallenges.First(c => c.ChallengeName == "Daily Meditation Sprint");
            var hydrationChallenge = context.WellnessChallenges.First(c => c.ChallengeName == "Water Hydration Log");

            // 9. Seed 15 Activity Logs
            var activityLogs = new List<ActivityLog>
            {
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = gopal.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 12500, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = gopal.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10200, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = arun.UserID, LogDate = DateTime.UtcNow.AddDays(-3), ActivityValue = 11000, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = meditationChallenge.ChallengeID, EmployeeID = balaji.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 15, PointsEarned = 50, Status = "Verified" },
                new ActivityLog { ChallengeID = hydrationChallenge.ChallengeID, EmployeeID = faisal.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 9, PointsEarned = 75, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = kavitha.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10500, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = meditationChallenge.ChallengeID, EmployeeID = jeeva.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 20, PointsEarned = 50, Status = "Verified" },
                new ActivityLog { ChallengeID = hydrationChallenge.ChallengeID, EmployeeID = naveen.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 8, PointsEarned = 75, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = indhu.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10000, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = meditationChallenge.ChallengeID, EmployeeID = lokesh.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 15, PointsEarned = 50, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = gowri.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10100, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = hydrationChallenge.ChallengeID, EmployeeID = meena.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 8, PointsEarned = 75, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = hari.UserID, LogDate = DateTime.UtcNow.AddDays(-2), ActivityValue = 10200, PointsEarned = 100, Status = "Verified" },
                new ActivityLog { ChallengeID = meditationChallenge.ChallengeID, EmployeeID = divya.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 15, PointsEarned = 50, Status = "Verified" },
                new ActivityLog { ChallengeID = stepsChallenge.ChallengeID, EmployeeID = chandru.UserID, LogDate = DateTime.UtcNow.AddDays(-1), ActivityValue = 10500, PointsEarned = 100, Status = "Verified" }
            };

            context.ActivityLogs.AddRange(activityLogs);
            context.SaveChanges();

            // 10. Seed 5 EAP Services
            var eapServices = new List<EAPService>
            {
                new EAPService { ServiceName = "Mental Health Counselling", Category = "MentalHealthCounselling", SessionsAllowedPerEmployee = 6, Status = "Active" },
                new EAPService { ServiceName = "Legal Consultation", Category = "LegalAdvisory", SessionsAllowedPerEmployee = 3, Status = "Active" },
                new EAPService { ServiceName = "Family Financial Planning", Category = "FinancialCounselling", SessionsAllowedPerEmployee = 4, Status = "Active" },
                new EAPService { ServiceName = "Grief & Bereavement Support", Category = "GriefSupport", SessionsAllowedPerEmployee = 6, Status = "Active" },
                new EAPService { ServiceName = "Work-Life Balance Advisory", Category = "WorkLifeAdvisory", SessionsAllowedPerEmployee = 5, Status = "Active" }
            };

            context.EAPServices.AddRange(eapServices);
            context.SaveChanges();

            var mentalService = context.EAPServices.First(s => s.Category == "MentalHealthCounselling");
            var legalService = context.EAPServices.First(s => s.Category == "LegalAdvisory");
            var financialService = context.EAPServices.First(s => s.Category == "FinancialCounselling");
            var griefService = context.EAPServices.First(s => s.Category == "GriefSupport");
            var worklifeService = context.EAPServices.First(s => s.Category == "WorkLifeAdvisory");

            // 11. Seed 10 EAP Sessions
            var sessions = new List<EAPSession>
            {
                new EAPSession { EmployeeID = gopal.UserID, ServiceID = mentalService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-3), SessionDate = DateTime.UtcNow.AddDays(2), CounsellorRef = "Dr. Linda Carter", Status = "Scheduled" },
                new EAPSession { EmployeeID = arun.UserID, ServiceID = legalService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-10), SessionDate = DateTime.UtcNow.AddDays(-5), CounsellorRef = "Adv. Prakash Raj", Status = "Completed" },
                new EAPSession { EmployeeID = divya.UserID, ServiceID = financialService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-1), Status = "Requested" },
                new EAPSession { EmployeeID = faisal.UserID, ServiceID = mentalService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-2), SessionDate = DateTime.UtcNow.AddDays(4), CounsellorRef = "Dr. Aditi Sharma", Status = "Scheduled" },
                new EAPSession { EmployeeID = kavitha.UserID, ServiceID = griefService.ServiceID, RequestedDate = DateTime.UtcNow, Status = "Requested" },
                new EAPSession { EmployeeID = chandru.UserID, ServiceID = financialService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-8), SessionDate = DateTime.UtcNow.AddDays(-2), CounsellorRef = "Fin. Adv. Anil Murthy", Status = "Completed" },
                new EAPSession { EmployeeID = meena.UserID, ServiceID = mentalService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-4), SessionDate = DateTime.UtcNow.AddDays(1), CounsellorRef = "Dr. Linda Carter", Status = "Scheduled" },
                new EAPSession { EmployeeID = lokesh.UserID, ServiceID = worklifeService.ServiceID, RequestedDate = DateTime.UtcNow, Status = "Requested" },
                new EAPSession { EmployeeID = gowri.UserID, ServiceID = legalService.ServiceID, RequestedDate = DateTime.UtcNow, Status = "Requested" },
                new EAPSession { EmployeeID = balaji.UserID, ServiceID = griefService.ServiceID, RequestedDate = DateTime.UtcNow.AddDays(-12), SessionDate = DateTime.UtcNow.AddDays(-3), CounsellorRef = "Dr. Aditi Sharma", Status = "Completed" }
            };

            context.EAPSessions.AddRange(sessions);
            context.SaveChanges();

            // 12. Seed 15 Recognition Awards
            var awards = new List<RecognitionAward>
            {
                new RecognitionAward { NominatorID = pradeep.UserID, RecipientID = gopal.UserID, Category = "PeerRecognition", BadgeName = "Collaborator Champion", PointsAwarded = 150, Message = "Great job coordinating the deployment of the benefits API! Super helpful and professional.", AwardDate = DateTime.UtcNow.AddDays(-4), Status = "Awarded" },
                new RecognitionAward { NominatorID = dharshan.UserID, RecipientID = gopal.UserID, Category = "PeerRecognition", BadgeName = "Team Player", PointsAwarded = 1000, Message = "Outstanding work supporting the benefits testing!", AwardDate = DateTime.UtcNow.AddDays(-1), Status = "Awarded" },
                new RecognitionAward { NominatorID = madhav.UserID, RecipientID = dharshan.UserID, Category = "ManagementRecognition", BadgeName = "Execution Star", PointsAwarded = 200, Message = "Great benefits planning and open window administration.", AwardDate = DateTime.UtcNow.AddDays(-5), Status = "Awarded" },
                new RecognitionAward { NominatorID = gopal.UserID, RecipientID = faisal.UserID, Category = "PeerRecognition", BadgeName = "Problem Solver", PointsAwarded = 100, Message = "Thanks for the database setup and config support.", AwardDate = DateTime.UtcNow.AddDays(-2), Status = "Awarded" },
                new RecognitionAward { NominatorID = vignesh.UserID, RecipientID = hari.UserID, Category = "PeerRecognition", BadgeName = "Detail Master", PointsAwarded = 150, Message = "Clean financial reconciliations and auditing support.", AwardDate = DateTime.UtcNow.AddDays(-3), Status = "Awarded" },
                new RecognitionAward { NominatorID = arun.UserID, RecipientID = balaji.UserID, Category = "PeerRecognition", BadgeName = "Customer Care", PointsAwarded = 50, Message = "Quick sales advice and advice on client enrollment options.", AwardDate = DateTime.UtcNow.AddDays(-2), Status = "Awarded" },
                new RecognitionAward { NominatorID = divya.UserID, RecipientID = meena.UserID, Category = "PeerRecognition", BadgeName = "Innovator", PointsAwarded = 200, Message = "Fantastic research support on the wellness program deliverables.", AwardDate = DateTime.UtcNow.AddDays(-6), Status = "Awarded" },
                new RecognitionAward { NominatorID = eshwar.UserID, RecipientID = lokesh.UserID, Category = "PeerRecognition", BadgeName = "Creative Thinker", PointsAwarded = 100, Message = "Great marketing assistance and presentation edits.", AwardDate = DateTime.UtcNow.AddDays(-1), Status = "Awarded" },
                new RecognitionAward { NominatorID = faisal.UserID, RecipientID = indhu.UserID, Category = "PeerRecognition", BadgeName = "Collaborator Champion", PointsAwarded = 150, Message = "Collaboration on IT deployment issues and code review.", AwardDate = DateTime.UtcNow.AddDays(-4), Status = "Awarded" },
                new RecognitionAward { NominatorID = gowri.UserID, RecipientID = nishanth.UserID, Category = "PeerRecognition", BadgeName = "Wellness Champion", PointsAwarded = 100, Message = "Support on onboarding new employees and logging wellness.", AwardDate = DateTime.UtcNow.AddDays(-5), Status = "Awarded" },
                new RecognitionAward { NominatorID = kavitha.UserID, RecipientID = jeeva.UserID, Category = "PeerRecognition", BadgeName = "Problem Solver", PointsAwarded = 100, Message = "Help resolving client queries on dental benefit plans.", AwardDate = DateTime.UtcNow.AddDays(-2), Status = "Awarded" },
                new RecognitionAward { NominatorID = lokesh.UserID, RecipientID = chandru.UserID, Category = "PeerRecognition", BadgeName = "Team Player", PointsAwarded = 50, Message = "Good campaign feedback and assistance in marketing setups.", AwardDate = DateTime.UtcNow.AddDays(-3), Status = "Awarded" },
                new RecognitionAward { NominatorID = naveen.UserID, RecipientID = faisal.UserID, Category = "PeerRecognition", BadgeName = "Detail Master", PointsAwarded = 100, Message = "Server administration support and database tuning tips.", AwardDate = DateTime.UtcNow.AddDays(-1), Status = "Awarded" },
                new RecognitionAward { NominatorID = meena.UserID, RecipientID = divya.UserID, Category = "PeerRecognition", BadgeName = "Execution Star", PointsAwarded = 150, Message = "Exceptional project leadership and clear task delivery.", AwardDate = DateTime.UtcNow.AddDays(-6), Status = "Awarded" },
                new RecognitionAward { NominatorID = jeeva.UserID, RecipientID = arun.UserID, Category = "PeerRecognition", BadgeName = "Customer Care", PointsAwarded = 50, Message = "Help in operations coordination during plan migrations.", AwardDate = DateTime.UtcNow.AddDays(-1), Status = "Awarded" }
            };

            context.RecognitionAwards.AddRange(awards);
            context.SaveChanges();

            // 13. Seed Reward Points for all 20 users
            var rewardPoints = new List<RewardPoints>
            {
                new RewardPoints { EmployeeID = gopal.UserID, TotalEarned = 1150, TotalRedeemed = 250, Balance = 900, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = dharshan.UserID, TotalEarned = 500, TotalRedeemed = 0, Balance = 500, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = vignesh.UserID, TotalEarned = 200, TotalRedeemed = 0, Balance = 200, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = nishanth.UserID, TotalEarned = 100, TotalRedeemed = 0, Balance = 100, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = pradeep.UserID, TotalEarned = 100, TotalRedeemed = 0, Balance = 100, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = madhav.UserID, TotalEarned = 100, TotalRedeemed = 0, Balance = 100, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = arun.UserID, TotalEarned = 250, TotalRedeemed = 50, Balance = 200, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = balaji.UserID, TotalEarned = 350, TotalRedeemed = 100, Balance = 250, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = chandru.UserID, TotalEarned = 450, TotalRedeemed = 0, Balance = 450, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = divya.UserID, TotalEarned = 600, TotalRedeemed = 200, Balance = 400, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = eshwar.UserID, TotalEarned = 200, TotalRedeemed = 0, Balance = 200, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = faisal.UserID, TotalEarned = 750, TotalRedeemed = 250, Balance = 500, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = gowri.UserID, TotalEarned = 300, TotalRedeemed = 0, Balance = 300, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = hari.UserID, TotalEarned = 450, TotalRedeemed = 0, Balance = 450, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = indhu.UserID, TotalEarned = 550, TotalRedeemed = 150, Balance = 400, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = jeeva.UserID, TotalEarned = 350, TotalRedeemed = 0, Balance = 350, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = kavitha.UserID, TotalEarned = 400, TotalRedeemed = 0, Balance = 400, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = lokesh.UserID, TotalEarned = 350, TotalRedeemed = 0, Balance = 350, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = meena.UserID, TotalEarned = 600, TotalRedeemed = 200, Balance = 400, LastUpdated = DateTime.UtcNow },
                new RewardPoints { EmployeeID = naveen.UserID, TotalEarned = 300, TotalRedeemed = 0, Balance = 300, LastUpdated = DateTime.UtcNow }
            };

            context.RewardPoints.AddRange(rewardPoints);
            context.SaveChanges();

            // 14. Seed 6 Redemption Catalog Items
            var catalogItems = new List<RedemptionCatalog>
            {
                new RedemptionCatalog { ItemName = "$50 Amazon Gift Card", Category = "Voucher", PointsRequired = 500, AvailableQuantity = 150, Status = "Available" },
                new RedemptionCatalog { ItemName = "Ergonomic Office Chair Cushion", Category = "Merchandise", PointsRequired = 1000, AvailableQuantity = 15, Status = "Available" },
                new RedemptionCatalog { ItemName = "Premium Gym Bag", Category = "Merchandise", PointsRequired = 800, AvailableQuantity = 30, Status = "Available" },
                new RedemptionCatalog { ItemName = "1-Hour Massage Session", Category = "Experience", PointsRequired = 1800, AvailableQuantity = 8, Status = "Available" },
                new RedemptionCatalog { ItemName = "$25 UNICEF Donation", Category = "Charity", PointsRequired = 250, AvailableQuantity = 9999, Status = "Available" },
                new RedemptionCatalog { ItemName = "Noise Cancelling Earbuds", Category = "Electronics", PointsRequired = 2500, AvailableQuantity = 5, Status = "Available" }
            };

            context.RedemptionCatalogs.AddRange(catalogItems);
            context.SaveChanges();

            // 15. Seed 5 Benefits Reports
            var reports = new List<BenefitsReport>
            {
                new BenefitsReport { Scope = "Company", Metrics = "{\"EnrolmentRate\":85.0,\"PremiumCost\":12500.0,\"ClaimsSubmitted\":5,\"WellnessParticipation\":12,\"EAPUtilisation\":4,\"RecognitionCount\":15,\"PointsRedeemed\":1400.0,\"TotalEmployees\":20}", GeneratedDate = DateTime.UtcNow.AddDays(-30) },
                new BenefitsReport { Scope = "Company", Metrics = "{\"EnrolmentRate\":90.0,\"PremiumCost\":13400.0,\"ClaimsSubmitted\":6,\"WellnessParticipation\":14,\"EAPUtilisation\":5,\"RecognitionCount\":18,\"PointsRedeemed\":1650.0,\"TotalEmployees\":20}", GeneratedDate = DateTime.UtcNow.AddDays(-15) },
                new BenefitsReport { Scope = "Company", Metrics = "{\"EnrolmentRate\":95.0,\"PremiumCost\":14200.0,\"ClaimsSubmitted\":8,\"WellnessParticipation\":15,\"EAPUtilisation\":6,\"RecognitionCount\":20,\"PointsRedeemed\":1900.0,\"TotalEmployees\":20}", GeneratedDate = DateTime.UtcNow.AddDays(-1) },
                new BenefitsReport { Scope = "Department-IT", Metrics = "{\"EnrolmentRate\":100.0,\"PremiumCost\":3400.0,\"ClaimsSubmitted\":2,\"WellnessParticipation\":4,\"EAPUtilisation\":2,\"RecognitionCount\":5,\"PointsRedeemed\":600.0,\"TotalEmployees\":4}", GeneratedDate = DateTime.UtcNow.AddDays(-1) },
                new BenefitsReport { Scope = "Department-HR", Metrics = "{\"EnrolmentRate\":92.0,\"PremiumCost\":4100.0,\"ClaimsSubmitted\":3,\"WellnessParticipation\":3,\"EAPUtilisation\":1,\"RecognitionCount\":6,\"PointsRedeemed\":550.0,\"TotalEmployees\":4}", GeneratedDate = DateTime.UtcNow.AddDays(-1) }
            };

            context.BenefitsReports.AddRange(reports);
            context.SaveChanges();

            // 16. Seed 20 Notifications
            var notifications = new List<Notification>
            {
                new Notification { UserID = gopal.UserID, Message = "Welcome to WellBeing360! The open enrollment window is now active.", Category = "Enrolment", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = gopal.UserID, Message = "Your 10K Steps Challenge activity log has been verified.", Category = "Wellness", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-2) },
                new Notification { UserID = gopal.UserID, Message = "You received a new Recognition Award from pradeep!", Category = "Recognition", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-4) },
                new Notification { UserID = dharshan.UserID, Message = "Welcome to WellBeing360 Benefits Portal.", Category = "System", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = vignesh.UserID, Message = "Welcome to WellBeing360 Finance Dashboard.", Category = "System", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = nishanth.UserID, Message = "Welcome to WellBeing360 Wellness Program Console.", Category = "System", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = pradeep.UserID, Message = "Welcome to WellBeing360 Recognition Board.", Category = "System", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = madhav.UserID, Message = "Welcome to WellBeing360 System Admin Console.", Category = "System", Status = "Read", CreatedDate = DateTime.UtcNow.AddDays(-10) },
                new Notification { UserID = arun.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = balaji.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = chandru.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = divya.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = eshwar.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = faisal.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = gowri.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = hari.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = indhu.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = jeeva.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = kavitha.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) },
                new Notification { UserID = lokesh.UserID, Message = "Welcome to WellBeing360!", Category = "System", Status = "Unread", CreatedDate = DateTime.UtcNow.AddDays(-9) }
            };

            context.Notifications.AddRange(notifications);
            context.SaveChanges();

            // 17. Seed 15 Audit Logs
            var auditLogs = new List<AuditLog>
            {
                new AuditLog { UserID = madhav.UserID, Action = "Seed Database", Module = "System", Timestamp = DateTime.UtcNow.AddDays(-10) },
                new AuditLog { UserID = dharshan.UserID, Action = "Create Silver Health Plan", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-10) },
                new AuditLog { UserID = gopal.UserID, Action = "Enroll in Silver Health Insurance", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-5) },
                new AuditLog { UserID = vignesh.UserID, Action = "Generate Utilization Report", Module = "Reports", Timestamp = DateTime.UtcNow.AddDays(-3) },
                new AuditLog { UserID = nishanth.UserID, Action = "Schedule Wellness Program", Module = "Wellness", Timestamp = DateTime.UtcNow.AddDays(-4) },
                new AuditLog { UserID = pradeep.UserID, Action = "Nominate Employee gopal", Module = "Recognition", Timestamp = DateTime.UtcNow.AddDays(-2) },
                new AuditLog { UserID = faisal.UserID, Action = "Register User account", Module = "Auth", Timestamp = DateTime.UtcNow.AddDays(-8) },
                new AuditLog { UserID = arun.UserID, Action = "Book counselling session", Module = "EAP", Timestamp = DateTime.UtcNow.AddDays(-2) },
                new AuditLog { UserID = divya.UserID, Action = "Enroll in Flex Benefit Plan", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-3) },
                new AuditLog { UserID = balaji.UserID, Action = "Log wellness activity", Module = "Wellness", Timestamp = DateTime.UtcNow.AddDays(-1) },
                new AuditLog { UserID = kavitha.UserID, Action = "Add dependent info", Module = "Benefits", Timestamp = DateTime.UtcNow.AddDays(-1) },
                new AuditLog { UserID = chandru.UserID, Action = "Complete EAP Session details", Module = "EAP", Timestamp = DateTime.UtcNow.AddDays(-1) },
                new AuditLog { UserID = meena.UserID, Action = "Check reward points balance", Module = "Recognition", Timestamp = DateTime.UtcNow.AddDays(-1) },
                new AuditLog { UserID = lokesh.UserID, Action = "Register User account", Module = "Auth", Timestamp = DateTime.UtcNow.AddDays(-6) },
                new AuditLog { UserID = gowri.UserID, Action = "Check pending notifications", Module = "System", Timestamp = DateTime.UtcNow.AddHours(-1) }
            };

            context.AuditLogs.AddRange(auditLogs);
            context.SaveChanges();
        }
    }
}
