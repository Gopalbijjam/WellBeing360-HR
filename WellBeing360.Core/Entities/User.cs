namespace WellBeing360.Core.Entities
{
    public class User
    {
        public int UserID { get; set; }
        public string EmployeeID { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // Employee, HRBenefitsAdmin, Finance, WellnessCoordinator, RecognitionManager, Admin
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string GradeID { get; set; } = string.Empty; // e.g. G1, G2, G3, G4
        public string DepartmentID { get; set; } = string.Empty; // e.g. IT, HR, Finance, Operations
        public string Password { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; // Active, Inactive
    }
}
