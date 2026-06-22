using System;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;

namespace WellBeing360.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IRepository<AuditLog> AuditLogs { get; }
        IBenefitPlanRepository BenefitPlans { get; }
        IRepository<FlexBenefitBucket> FlexBenefitBuckets { get; }
        IRepository<EnrolmentWindow> EnrolmentWindows { get; }
        IRepository<BenefitEnrolment> BenefitEnrolments { get; }
        IRepository<Dependent> Dependents { get; }
        IRepository<WellnessProgram> WellnessPrograms { get; }
        IRepository<WellnessChallenge> WellnessChallenges { get; }
        IRepository<ActivityLog> ActivityLogs { get; }
        IRepository<EAPService> EAPServices { get; }
        IRepository<EAPSession> EAPSessions { get; }
        IRepository<RecognitionAward> RecognitionAwards { get; }
        IRepository<RewardPoints> RewardPoints { get; }
        IRepository<RedemptionCatalog> RedemptionCatalogItems { get; }
        IRepository<BenefitsReport> BenefitsReports { get; }
        IRepository<Notification> Notifications { get; }
        Task<int> CompleteAsync();
    }
}
