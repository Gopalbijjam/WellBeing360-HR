using System;

namespace WellBeing360.Core.DTOs
{
    public class ActivityLogRequest
    {
        public int ChallengeID { get; set; }
        public decimal ActivityValue { get; set; }
        public DateTime LogDate { get; set; }
    }

    public class ActivityLogResponse
    {
        public int LogID { get; set; }
        public string ChallengeName { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty;
        public decimal ActivityValue { get; set; }
        public int PointsEarned { get; set; }
        public DateTime LogDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class LeaderboardEntryDTO
    {
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string DepartmentID { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int Rank { get; set; }
    }

    public class CoordinatorActivityLogResponse
    {
        public int LogID { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string ChallengeName { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty;
        public decimal ActivityValue { get; set; }
        public int PointsEarned { get; set; }
        public DateTime LogDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
