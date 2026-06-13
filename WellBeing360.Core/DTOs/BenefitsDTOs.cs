using System;
using System.Collections.Generic;

namespace WellBeing360.Core.DTOs
{
    public class DependentDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty; // Spouse, Child, Parent
        public DateTime DateOfBirth { get; set; }
    }

    public class EnrolmentRequest
    {
        public int PlanID { get; set; }
        public int WindowID { get; set; }
        public string CoverageOption { get; set; } = string.Empty; // EmployeeOnly, EmployeeSpouse, Family
        public List<DependentDTO> Dependents { get; set; } = new List<DependentDTO>();
    }

    public class EnrolmentResponse
    {
        public int EnrolmentID { get; set; }
        public int EmployeeID { get; set; }
        public int PlanID { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public string CoverageOption { get; set; } = string.Empty;
        public decimal EmployeeContributionAmount { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
