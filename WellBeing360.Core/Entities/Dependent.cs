using System;

namespace WellBeing360.Core.Entities
{
    public class Dependent
    {
        public int DependentID { get; set; }
        public int EmployeeID { get; set; } // Foreign Key to User
        public string Name { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty; // Spouse, Child, Parent
        public DateTime DateOfBirth { get; set; }
        public string Status { get; set; } = "Active"; // Active, Removed

        // Navigation property
        public User? Employee { get; set; }
    }
}
