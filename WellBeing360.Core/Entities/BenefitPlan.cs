using System;
using System.Collections.Generic;

namespace WellBeing360.Core.Entities
{
    public class BenefitPlan
    {
        public int PlanID { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty; // GroupHealthInsurance, LifeCover, DentalVision, FlexibleBenefit, RetirementContrib, Commuter
        public string EligibilityGrade { get; set; } = string.Empty; // comma-separated grades e.g. "G1,G2,G3" or "All"
        public decimal EmployeeContribution { get; set; }
        public decimal EmployerContribution { get; set; }
        public decimal CoverageLimit { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string Status { get; set; } = "Active"; // Active, Discontinued

        // Navigation property for buckets (if flexible benefit type)
        public ICollection<FlexBenefitBucket> FlexBuckets { get; set; } = new List<FlexBenefitBucket>();
    }
}
