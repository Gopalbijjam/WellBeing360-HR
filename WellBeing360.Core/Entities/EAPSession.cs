using System;

namespace WellBeing360.Core.Entities
{
    public class EAPSession
    {
        public int SessionID { get; set; }
        public int EmployeeID { get; set; } // Foreign Key to User
        public int ServiceID { get; set; }  // Foreign Key to EAPService
        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
        public DateTime SessionDate { get; set; }
        public string CounsellorRef { get; set; } = string.Empty;
        public string Status { get; set; } = "Requested"; // Requested, Scheduled, Completed, Cancelled

        // Navigation properties
        public User? Employee { get; set; }
        public EAPService? Service { get; set; }
    }
}
