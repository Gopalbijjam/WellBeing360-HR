using System;

namespace WellBeing360.Core.Entities
{
    public class ActivityLog
    {
        public int LogID { get; set; }
        public int ChallengeID { get; set; }
        public int EmployeeID { get; set; } // Foreign Key to User
        public DateTime LogDate { get; set; }
        public decimal ActivityValue { get; set; }
        public int PointsEarned { get; set; }
        public string Status { get; set; } = "Submitted"; // Submitted, Verified

        // Navigation properties
        public WellnessChallenge? Challenge { get; set; }
        public User? Employee { get; set; }
    }
}
