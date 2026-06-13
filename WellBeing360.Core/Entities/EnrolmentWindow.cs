using System;

namespace WellBeing360.Core.Entities
{
    public class EnrolmentWindow
    {
        public int WindowID { get; set; }
        public int PlanYear { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime CloseDate { get; set; }
        public string EligibleGrades { get; set; } = string.Empty; // e.g. "G1,G2,G3" or "All"
        public string Status { get; set; } = "Upcoming"; // Upcoming, Open, Closed
    }
}
