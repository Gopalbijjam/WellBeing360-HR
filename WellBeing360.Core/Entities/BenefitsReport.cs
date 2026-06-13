using System;

namespace WellBeing360.Core.Entities
{
    public class BenefitsReport
    {
        public int ReportID { get; set; }
        public string Scope { get; set; } = string.Empty; // Department, Grade, Plan, Period
        public string Metrics { get; set; } = string.Empty; // JSON or serialized summary of EnrolmentRate, PremiumCost, ClaimsSubmitted, WellnessParticipation, EAPUtilisation, RecognitionCount, PointsRedeemed
        public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
    }
}
