using System;

namespace WellBeing360.Core.Entities
{
    public class RewardPoints
    {
        public int PointsID { get; set; }
        public int EmployeeID { get; set; } // Foreign Key to User
        public int TotalEarned { get; set; }
        public int TotalRedeemed { get; set; }
        public int Balance { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation property
        public User? Employee { get; set; }
    }
}
