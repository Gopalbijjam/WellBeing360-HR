using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class ReportManagementService : IReportManagementService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReportManagementService(IReportRepository reportRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            _reportRepository = reportRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<BenefitsReport> GenerateReportAsync(string scope)
        {
            // Gather statistics
            var users = await _userRepository.GetAllAsync();
            var totalEmployees = users.Count(u => u.Role == "Employee");

            var enrolments = await _unitOfWork.BenefitEnrolments.GetAllAsync();
            var enrolledCount = enrolments.Select(e => e.EmployeeID).Distinct().Count();

            double enrolmentRate = totalEmployees > 0 ? (double)enrolledCount / totalEmployees * 100.0 : 0.0;

            var plans = await _unitOfWork.BenefitPlans.GetAllAsync();
            var plansMap = plans.ToDictionary(p => p.PlanID, p => p);

            decimal totalPremiumCost = enrolments
                .Where(e => e.Status == "Active" || e.Status == "Submitted")
                .Sum(e => plansMap.TryGetValue(e.PlanID, out var p) ? p.EmployerContribution : 0);

            var activityLogs = await _unitOfWork.ActivityLogs.GetAllAsync();
            var totalWellnessLogs = activityLogs.Count();

            var sessions = await _unitOfWork.EAPSessions.GetAllAsync();
            var totalEapSessions = sessions.Count();

            var awards = await _unitOfWork.RecognitionAwards.GetAllAsync();
            var totalAwards = awards.Count();

            var rewardPoints = await _unitOfWork.RewardPoints.GetAllAsync();
            var totalPointsRedeemed = rewardPoints.Sum(rp => rp.TotalRedeemed);

            var metricsObj = new
            {
                EnrolmentRate = Math.Round(enrolmentRate, 2),
                PremiumCost = totalPremiumCost,
                ClaimsSubmitted = totalEapSessions, // Using EAP sessions as a proxy for claims/counselling utilisation
                WellnessParticipation = totalWellnessLogs,
                EAPUtilisation = totalEapSessions,
                RecognitionCount = totalAwards,
                PointsRedeemed = totalPointsRedeemed,
                TotalEmployees = totalEmployees
            };

            var report = new BenefitsReport
            {
                Scope = scope,
                Metrics = JsonSerializer.Serialize(metricsObj),
                GeneratedDate = DateTime.UtcNow
            };

            await _reportRepository.AddReportAsync(report);
            await _unitOfWork.CompleteAsync();

            return report;
        }

        public async Task<IEnumerable<BenefitsReport>> GetReportsAsync()
        {
            return await _unitOfWork.BenefitsReports.GetAllAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogsAsync()
        {
            return await _unitOfWork.AuditLogs.GetAllAsync();
        }
    }
}
