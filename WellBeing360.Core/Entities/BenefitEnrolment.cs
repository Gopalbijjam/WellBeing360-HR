using System;

namespace WellBeing360.Core.Entities
{
    public class BenefitEnrolment
    {
        public int EnrolmentID { get; set; }
        public int EmployeeID { get; set; } // Foreign Key to User
        public int PlanID { get; set; }     // Foreign Key to BenefitPlan
        public int WindowID { get; set; }   // Foreign Key to EnrolmentWindow
        public string CoverageOption { get; set; } = string.Empty; // EmployeeOnly, EmployeeSpouse, Family
        public bool DependentsIncluded { get; set; }
        public decimal EmployeeContributionAmount { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, Submitted, Active, Lapsed, Cancelled

        // Navigation properties
        public User? Employee { get; set; }
        public BenefitPlan? BenefitPlan { get; set; }
        public EnrolmentWindow? EnrolmentWindow { get; set; }
    }
}
