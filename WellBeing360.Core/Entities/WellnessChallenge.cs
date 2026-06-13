namespace WellBeing360.Core.Entities
{
    public class WellnessChallenge
    {
        public int ChallengeID { get; set; }
        public int ProgramID { get; set; }
        public string ChallengeName { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty; // Steps, Meditation, WaterIntake, SleepLog, NutritionTrack
        public int DailyTarget { get; set; }
        public int Duration { get; set; } // Duration in days
        public int PointsPerCompletion { get; set; }
        public string Status { get; set; } = "Active"; // Active, Completed

        // Navigation property
        public WellnessProgram? Program { get; set; }
    }
}
