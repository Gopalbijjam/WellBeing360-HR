using Microsoft.EntityFrameworkCore;
using WellBeing360.Core.Entities;

namespace WellBeing360.Infrastructure.Data
{
    public class WellBeingContext : DbContext
    {
        public WellBeingContext(DbContextOptions<WellBeingContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;
        public DbSet<BenefitPlan> BenefitPlans { get; set; } = null!;
        public DbSet<FlexBenefitBucket> FlexBenefitBuckets { get; set; } = null!;
        public DbSet<EnrolmentWindow> EnrolmentWindows { get; set; } = null!;
        public DbSet<BenefitEnrolment> BenefitEnrolments { get; set; } = null!;
        public DbSet<Dependent> Dependents { get; set; } = null!;
        public DbSet<WellnessProgram> WellnessPrograms { get; set; } = null!;
        public DbSet<WellnessChallenge> WellnessChallenges { get; set; } = null!;
        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;
        public DbSet<EAPService> EAPServices { get; set; } = null!;
        public DbSet<EAPSession> EAPSessions { get; set; } = null!;
        public DbSet<RecognitionAward> RecognitionAwards { get; set; } = null!;
        public DbSet<RewardPoints> RewardPoints { get; set; } = null!;
        public DbSet<RedemptionCatalog> RedemptionCatalogs { get; set; } = null!;
        public DbSet<BenefitsReport> BenefitsReports { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User mapping
            modelBuilder.Entity<User>().HasKey(u => u.UserID);

            // AuditLog mapping
            modelBuilder.Entity<AuditLog>().HasKey(a => a.AuditID);
            modelBuilder.Entity<AuditLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // BenefitPlan mapping
            modelBuilder.Entity<BenefitPlan>().HasKey(b => b.PlanID);

            // FlexBenefitBucket mapping
            modelBuilder.Entity<FlexBenefitBucket>().HasKey(fb => fb.BucketID);
            modelBuilder.Entity<FlexBenefitBucket>()
                .HasOne(fb => fb.BenefitPlan)
                .WithMany(bp => bp.FlexBuckets)
                .HasForeignKey(fb => fb.PlanID)
                .OnDelete(DeleteBehavior.Cascade);

            // EnrolmentWindow mapping
            modelBuilder.Entity<EnrolmentWindow>().HasKey(ew => ew.WindowID);

            // BenefitEnrolment mapping
            modelBuilder.Entity<BenefitEnrolment>().HasKey(be => be.EnrolmentID);
            modelBuilder.Entity<BenefitEnrolment>()
                .HasOne(be => be.Employee)
                .WithMany()
                .HasForeignKey(be => be.EmployeeID)
                .OnDelete(DeleteBehavior.Restrict); // Avoid cascade path cycle

            modelBuilder.Entity<BenefitEnrolment>()
                .HasOne(be => be.BenefitPlan)
                .WithMany()
                .HasForeignKey(be => be.PlanID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BenefitEnrolment>()
                .HasOne(be => be.EnrolmentWindow)
                .WithMany()
                .HasForeignKey(be => be.WindowID)
                .OnDelete(DeleteBehavior.Restrict);

            // Dependent mapping
            modelBuilder.Entity<Dependent>().HasKey(d => d.DependentID);
            modelBuilder.Entity<Dependent>()
                .HasOne(d => d.Employee)
                .WithMany()
                .HasForeignKey(d => d.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // WellnessProgram mapping
            modelBuilder.Entity<WellnessProgram>().HasKey(wp => wp.ProgramID);

            // WellnessChallenge mapping
            modelBuilder.Entity<WellnessChallenge>().HasKey(wc => wc.ChallengeID);
            modelBuilder.Entity<WellnessChallenge>()
                .HasOne(wc => wc.Program)
                .WithMany(wp => wp.Challenges)
                .HasForeignKey(wc => wc.ProgramID)
                .OnDelete(DeleteBehavior.Cascade);

            // ActivityLog mapping
            modelBuilder.Entity<ActivityLog>().HasKey(al => al.LogID);
            modelBuilder.Entity<ActivityLog>()
                .HasOne(al => al.Challenge)
                .WithMany()
                .HasForeignKey(al => al.ChallengeID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ActivityLog>()
                .HasOne(al => al.Employee)
                .WithMany()
                .HasForeignKey(al => al.EmployeeID)
                .OnDelete(DeleteBehavior.Restrict); // Avoid cascade cycles

            // EAPService mapping
            modelBuilder.Entity<EAPService>().HasKey(es => es.ServiceID);

            // EAPSession mapping
            modelBuilder.Entity<EAPSession>().HasKey(eas => eas.SessionID);
            modelBuilder.Entity<EAPSession>()
                .HasOne(eas => eas.Employee)
                .WithMany()
                .HasForeignKey(eas => eas.EmployeeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EAPSession>()
                .HasOne(eas => eas.Service)
                .WithMany()
                .HasForeignKey(eas => eas.ServiceID)
                .OnDelete(DeleteBehavior.Cascade);

            // RecognitionAward mapping
            modelBuilder.Entity<RecognitionAward>().HasKey(ra => ra.AwardID);
            
            // Multiple relations to User: Nominator and Recipient
            modelBuilder.Entity<RecognitionAward>()
                .HasOne(ra => ra.Nominator)
                .WithMany()
                .HasForeignKey(ra => ra.NominatorID)
                .OnDelete(DeleteBehavior.Restrict); // Critical to prevent SQL Server cycles

            modelBuilder.Entity<RecognitionAward>()
                .HasOne(ra => ra.Recipient)
                .WithMany()
                .HasForeignKey(ra => ra.RecipientID)
                .OnDelete(DeleteBehavior.Restrict); // Critical to prevent SQL Server cycles

            // RewardPoints mapping
            modelBuilder.Entity<RewardPoints>().HasKey(rp => rp.PointsID);
            modelBuilder.Entity<RewardPoints>()
                .HasOne(rp => rp.Employee)
                .WithMany()
                .HasForeignKey(rp => rp.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // RedemptionCatalog mapping
            modelBuilder.Entity<RedemptionCatalog>().HasKey(rc => rc.ItemID);

            // BenefitsReport mapping
            modelBuilder.Entity<BenefitsReport>().HasKey(br => br.ReportID);

            // Notification mapping
            modelBuilder.Entity<Notification>().HasKey(n => n.NotificationID);
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserID)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
