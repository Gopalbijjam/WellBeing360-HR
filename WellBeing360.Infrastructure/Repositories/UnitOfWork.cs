using System;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using WellBeing360.Infrastructure.Data;

namespace WellBeing360.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly WellBeingContext _context;

        public UnitOfWork(WellBeingContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            AuditLogs = new GenericRepository<AuditLog>(_context);
            BenefitPlans = new BenefitPlanRepository(_context);
            FlexBenefitBuckets = new GenericRepository<FlexBenefitBucket>(_context);
            EnrolmentWindows = new GenericRepository<EnrolmentWindow>(_context);
            BenefitEnrolments = new GenericRepository<BenefitEnrolment>(_context);
            Dependents = new GenericRepository<Dependent>(_context);
            WellnessPrograms = new GenericRepository<WellnessProgram>(_context);
            WellnessChallenges = new GenericRepository<WellnessChallenge>(_context);
            ActivityLogs = new GenericRepository<ActivityLog>(_context);
            EAPServices = new GenericRepository<EAPService>(_context);
            EAPSessions = new GenericRepository<EAPSession>(_context);
            RecognitionAwards = new GenericRepository<RecognitionAward>(_context);
            RewardPoints = new GenericRepository<RewardPoints>(_context);
            RedemptionCatalogItems = new GenericRepository<RedemptionCatalog>(_context);
            BenefitsReports = new GenericRepository<BenefitsReport>(_context);
            Notifications = new GenericRepository<Notification>(_context);
        }

        public IUserRepository Users { get; }
        public IRepository<AuditLog> AuditLogs { get; }
        public IBenefitPlanRepository BenefitPlans { get; }
        public IRepository<FlexBenefitBucket> FlexBenefitBuckets { get; }
        public IRepository<EnrolmentWindow> EnrolmentWindows { get; }
        public IRepository<BenefitEnrolment> BenefitEnrolments { get; }
        public IRepository<Dependent> Dependents { get; }
        public IRepository<WellnessProgram> WellnessPrograms { get; }
        public IRepository<WellnessChallenge> WellnessChallenges { get; }
        public IRepository<ActivityLog> ActivityLogs { get; }
        public IRepository<EAPService> EAPServices { get; }
        public IRepository<EAPSession> EAPSessions { get; }
        public IRepository<RecognitionAward> RecognitionAwards { get; }
        public IRepository<RewardPoints> RewardPoints { get; }
        public IRepository<RedemptionCatalog> RedemptionCatalogItems { get; }
        public IRepository<BenefitsReport> BenefitsReports { get; }
        public IRepository<Notification> Notifications { get; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
