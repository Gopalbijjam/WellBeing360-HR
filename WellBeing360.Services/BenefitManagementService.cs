using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class BenefitManagementService : IBenefitManagementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BenefitManagementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<BenefitPlan>> GetPlansAsync()
        {
            return await _unitOfWork.BenefitPlans.GetAllAsync();
        }

        public async Task<BenefitPlan?> GetPlanByIdAsync(int id)
        {
            return await _unitOfWork.BenefitPlans.GetByIdAsync(id);
        }

        public async Task<BenefitPlan> CreatePlanAsync(BenefitPlan plan)
        {
            await _unitOfWork.BenefitPlans.AddAsync(plan);
            await _unitOfWork.CompleteAsync();
            return plan;
        }

        public async Task<IEnumerable<FlexBenefitBucket>> GetFlexBucketsAsync(int planId)
        {
            return await _unitOfWork.FlexBenefitBuckets.FindAsync(fb => fb.PlanID == planId);
        }

        public async Task<IEnumerable<EnrolmentWindow>> GetEnrolmentWindowsAsync()
        {
            return await _unitOfWork.EnrolmentWindows.GetAllAsync();
        }

        public async Task<EnrolmentWindow?> GetCurrentOpenWindowAsync()
        {
            var windows = await _unitOfWork.EnrolmentWindows.FindAsync(w => w.Status == "Open" && DateTime.UtcNow >= w.OpenDate && DateTime.UtcNow <= w.CloseDate);
            return windows.FirstOrDefault();
        }

        public async Task<EnrolmentWindow> CreateEnrolmentWindowAsync(EnrolmentWindow window)
        {
            await _unitOfWork.EnrolmentWindows.AddAsync(window);
            await _unitOfWork.CompleteAsync();
            return window;
        }

        public async Task<BenefitEnrolment?> EnrolEmployeeAsync(int employeeId, EnrolmentRequest request)
        {
            var employee = await _unitOfWork.Users.GetByIdAsync(employeeId);
            if (employee == null) return null;

            var plan = await _unitOfWork.BenefitPlans.GetByIdAsync(request.PlanID);
            if (plan == null || plan.Status != "Active") return null;

            var window = await _unitOfWork.EnrolmentWindows.GetByIdAsync(request.WindowID);
            if (window == null || window.Status != "Open") return null;

            // 1. Grade Eligibility Check
            if (plan.EligibilityGrade != "All")
            {
                var eligibleGrades = plan.EligibilityGrade.Split(',').Select(g => g.Trim().ToUpper());
                if (!eligibleGrades.Contains(employee.GradeID.ToUpper()))
                {
                    throw new InvalidOperationException($"Employee grade {employee.GradeID} is not eligible for this plan.");
                }
            }

            // 2. Clear existing enrolment for this plan/window if exists (update/replace)
            var existingEnrolments = await _unitOfWork.BenefitEnrolments.FindAsync(e => e.EmployeeID == employeeId && e.PlanID == request.PlanID && e.WindowID == request.WindowID);
            foreach (var existing in existingEnrolments)
            {
                _unitOfWork.BenefitEnrolments.Remove(existing);
            }

            // 3. Create Enrolment
            var enrolment = new BenefitEnrolment
            {
                EmployeeID = employeeId,
                PlanID = request.PlanID,
                WindowID = request.WindowID,
                CoverageOption = request.CoverageOption,
                DependentsIncluded = request.Dependents.Any(),
                EmployeeContributionAmount = plan.EmployeeContribution,
                EffectiveDate = window.CloseDate.AddDays(1).Date,
                Status = "Submitted"
            };

            await _unitOfWork.BenefitEnrolments.AddAsync(enrolment);

            // 4. Add Dependents
            if (request.Dependents.Any())
            {
                foreach (var depDto in request.Dependents)
                {
                    var dependent = new Dependent
                    {
                        EmployeeID = employeeId,
                        Name = depDto.Name,
                        Relationship = depDto.Relationship,
                        DateOfBirth = depDto.DateOfBirth,
                        Status = "Active"
                    };
                    await _unitOfWork.Dependents.AddAsync(dependent);
                }
            }

            // 5. Create Notification
            var notification = new Notification
            {
                UserID = employeeId,
                Message = $"Your enrolment in {plan.PlanName} has been submitted successfully.",
                Category = "Enrolment",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return enrolment;
        }

        public async Task<IEnumerable<BenefitEnrolment>> GetEmployeeEnrolmentsAsync(int employeeId)
        {
            return await _unitOfWork.BenefitEnrolments.FindAsync(e => e.EmployeeID == employeeId);
        }

        public async Task<IEnumerable<Dependent>> GetDependentsAsync(int employeeId)
        {
            return await _unitOfWork.Dependents.FindAsync(d => d.EmployeeID == employeeId && d.Status == "Active");
        }

        public async Task<Dependent> AddDependentAsync(int employeeId, DependentDTO dependentDto)
        {
            var dependent = new Dependent
            {
                EmployeeID = employeeId,
                Name = dependentDto.Name,
                Relationship = dependentDto.Relationship,
                DateOfBirth = dependentDto.DateOfBirth,
                Status = "Active"
            };
            await _unitOfWork.Dependents.AddAsync(dependent);
            await _unitOfWork.CompleteAsync();
            return dependent;
        }

        public async Task<bool> RemoveDependentAsync(int dependentId)
        {
            var dependent = await _unitOfWork.Dependents.GetByIdAsync(dependentId);
            if (dependent == null) return false;

            dependent.Status = "Removed";
            _unitOfWork.Dependents.Update(dependent);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<BenefitEnrolment>> GetAllEnrolmentsAsync()
        {
            var enrolments = await _unitOfWork.BenefitEnrolments.GetAllAsync();
            var users = await _unitOfWork.Users.GetAllAsync();
            var plans = await _unitOfWork.BenefitPlans.GetAllAsync();

            var userMap = users.ToDictionary(u => u.UserID, u => u);
            var planMap = plans.ToDictionary(p => p.PlanID, p => p);

            foreach (var e in enrolments)
            {
                if (userMap.TryGetValue(e.EmployeeID, out var u))
                {
                    e.Employee = u;
                }
                if (planMap.TryGetValue(e.PlanID, out var p))
                {
                    e.BenefitPlan = p;
                }
            }

            return enrolments;
        }

        public async Task<BenefitPlan?> UpdatePlanStatusAsync(int planId, string status)
        {
            var plan = await _unitOfWork.BenefitPlans.GetByIdAsync(planId);
            if (plan == null) return null;

            plan.Status = status;
            _unitOfWork.BenefitPlans.Update(plan);
            await _unitOfWork.CompleteAsync();
            return plan;
        }

        public async Task<BenefitEnrolment?> UpdateEnrolmentStatusAsync(int enrolmentId, string status)
        {
            var enrolment = await _unitOfWork.BenefitEnrolments.GetByIdAsync(enrolmentId);
            if (enrolment == null) return null;

            enrolment.Status = status;
            _unitOfWork.BenefitEnrolments.Update(enrolment);

            var plan = await _unitOfWork.BenefitPlans.GetByIdAsync(enrolment.PlanID);
            var planName = plan?.PlanName ?? "Benefit Plan";

            var notification = new Notification
            {
                UserID = enrolment.EmployeeID,
                Message = $"Your enrollment for plan '{planName}' has been {status}.",
                Category = "Enrolment",
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            await _unitOfWork.CompleteAsync();
            return enrolment;
        }
    }
}
