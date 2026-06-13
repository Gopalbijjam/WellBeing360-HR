using System;
using System.Collections.Generic;

namespace WellBeing360.Core.Entities
{
    public class WellnessProgram
    {
        public int ProgramID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Theme { get; set; } = string.Empty; // Fitness, Nutrition, MentalHealth, Preventive, WorkLifeBalance
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int PointsOnOffer { get; set; }
        public int TargetParticipation { get; set; }
        public string Status { get; set; } = "Upcoming"; // Upcoming, Active, Completed

        // Navigation property for challenges
        public ICollection<WellnessChallenge> Challenges { get; set; } = new List<WellnessChallenge>();
    }
}
